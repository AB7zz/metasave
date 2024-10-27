import cv2
import numpy as np
import torch
from torchvision import transforms
from yoloutils.datasets import letterbox
import asyncio
import websockets
import json
import base64
import firebase_admin
from firebase_admin import credentials, db
from dotenv import dotenv_values
from bleak import BleakClient, BleakScanner
import struct
import threading
import queue
from datetime import datetime

# Load environment variables
env_vars = dotenv_values()

# Firebase configuration
firebase_vars = {
    "type": env_vars["TYPE"],
    "project_id": env_vars["PROJECT_ID"],
    "private_key_id": env_vars["PRIVATE_KEY_ID"],
    "private_key": env_vars["PRIVATE_KEY"],
    "client_email": env_vars["CLIENT_EMAIL"],
    "client_id": env_vars["CLIENT_ID"],
    "auth_uri": env_vars["AUTH_URI"],
    "token_uri": env_vars["TOKEN_URI"],
    "auth_provider_x509_cert_url": env_vars["AUTH_PROVIDER_X509_CERT_URL"],
    "client_x509_cert_url": env_vars["CLIENT_X509_CERT_URL"],
    "universe_domain": env_vars["UNIVERSE_DOMAIN"]
}

# Write Firebase credentials to file
with open("firebase_credentials.json", "w") as f:
    json.dump(firebase_vars, f, indent=4)

# Initialize Firebase
cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': env_vars['DATABASE_URL']
})

fall_ref = db.reference('/fall')

# BLE Configuration
BLE_ADDRESS = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

class BLEManager:
    def __init__(self):
        self.device_address = None
        self.accelerometer_thread = None
        self.stop_event = asyncio.Event()
        self.queue = queue.Queue()
        self.fall_detected = False

    async def find_bluetooth_device(self, target_address):
        devices = await BleakScanner.discover()
        for device in devices:
            if device.address == target_address:
                return device.address
        return None

    async def read_characteristic(self, client, char_uuid):
        char_value = await client.read_gatt_char(char_uuid)
        return char_value

    async def read_characteristics(self, address):
        async with BleakClient(address) as client:
            while not self.stop_event.is_set():
                try:
                    char_values = await asyncio.gather(
                        self.read_characteristic(client, CHAR_UUID)
                    )
                    value = struct.unpack('<i', char_values[0])[0]
                    self.fall_detected = (value == 1)
                    self.queue.put(self.fall_detected)
                except Exception as e:
                    print(f"BLE Error: {e}")
                await asyncio.sleep(0.1)

    def read_accel_data(self, address):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(self.read_characteristics(address))

    async def initialize(self):
        self.device_address = await self.find_bluetooth_device(BLE_ADDRESS)
        if self.device_address:
            print(f"Bluetooth device found at {self.device_address}")
            self.accelerometer_thread = threading.Thread(
                target=self.read_accel_data,
                args=(self.device_address,)
            )
            self.accelerometer_thread.start()
        else:
            print("Bluetooth device not found")

    def cleanup(self):
        self.stop_event.set()
        if self.accelerometer_thread:
            self.accelerometer_thread.join()

class FallDetectionClient:
    def __init__(self, server_url='ws://43.133.109.85:6060/ws'):
        self.server_url = server_url
        self.ble_manager = BLEManager()
        
        # Pre-compute transform for better performance
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.ConvertImageDtype(torch.float16)
        ])
        
        # Cache frequently used values
        self.scale_percent = 25
        self.stride = 64
        
    def preprocess_frame(self, frame):
        height, width = frame.shape[:2]
        new_width = int(width * self.scale_percent / 100)
        new_height = int(height * self.scale_percent / 100)
        
        frame = cv2.resize(frame, (new_width, new_height), 
                         interpolation=cv2.INTER_NEAREST)
        
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = letterbox(image, (new_width), stride=self.stride, auto=False)[0]
        image = self.transform(image)
        image = image.unsqueeze(0)
        
        return image, frame
    
    @torch.no_grad()
    def encode_tensor(self, tensor):
        return base64.b64encode(tensor.numpy().tobytes()).decode('utf-8')
    
    async def process_video(self, video_path):
        # Initialize BLE
        await self.ble_manager.initialize()
        
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError("Error opening video file")
            
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)
            
            websocket_kwargs = {
                'max_size': None,
                'ping_interval': None,
                'compression': None
            }
            
            frame_count = 0
            skip_frames = 2
            
            async with websockets.connect(self.server_url, **websocket_kwargs) as websocket:
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                    
                    frame_count += 1
                    if frame_count % skip_frames != 0:
                        continue
                    
                    # Preprocess frame
                    processed_frame, display_frame = self.preprocess_frame(frame)
                    
                    # Prepare frame data
                    frame_data = {
                        'frame': self.encode_tensor(processed_frame),
                        'height': int(processed_frame.shape[2]),
                        'width': int(processed_frame.shape[3])
                    }
                    
                    # Check BLE data
                    ble_fall_detected = None
                    if not self.ble_manager.queue.empty():
                        ble_fall_detected = self.ble_manager.queue.get()
                    
                    # Send frame data and BLE status
                    frame_data['ble_fall_detected'] = ble_fall_detected
                    await websocket.send(json.dumps(frame_data))
                    
                    # Get and parse prediction
                    result = json.loads(await websocket.recv())
                    
                    # Update Firebase if fall detected
                    if result['fallen'] or ble_fall_detected:
                        now = datetime.now()
                        prediction_data = {
                            'username': 'ALOSH',
                            'timestamp': now.strftime('%H:%M:%S'),
                            'date': now.strftime('%d-%m-%Y'),
                            'status': 'fallen',
                            'camera_detection': result['fallen'],
                            'wearable_detection': ble_fall_detected
                        }
                        fall_ref.set(prediction_data)
                    
                    # Display results
                    if result['fallen'] or ble_fall_detected:
                        status = "FALL DETECTED!"
                        color = (0, 0, 255)
                    else:
                        status = "No fall"
                        color = (0, 255, 0)
                    
                    cv2.putText(display_frame, status, (10, 30),
                              cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2,
                              cv2.LINE_AA)
                    
                    cv2.imshow('Fall Detection', display_frame)
                    
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                    
                    await asyncio.sleep(0.005)
                    
        finally:
            cap.release()
            cv2.destroyAllWindows()
            self.ble_manager.cleanup()

    def run(self, video_path):
        try:
            if hasattr(asyncio, 'WindowsSelectorEventLoopPolicy'):
                asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        except:
            pass
            
        asyncio.run(self.process_video(video_path))

if __name__ == "__main__":
    client = FallDetectionClient()
    client.run(r"D:\VSCODE\metasave\packages\model\fall.mp4")