import torch
import cv2
import math
from torchvision import transforms
import numpy as np
from yoloutils.datasets import letterbox
from yoloutils.general import non_max_suppression
from yoloutils.plots import output_to_target
from datetime import datetime, timedelta
import requests
import json
from io import BytesIO
from dotenv import dotenv_values
import threading
import queue
import asyncio
from bleak import BleakClient
import bleak
import firebase_admin
from firebase_admin import credentials, db
from dotenv import dotenv_values
import struct

env_vars = dotenv_values()

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

json_str = json.dumps(firebase_vars, indent=4)

with open("packages/model/firebase_credentials.json", "w") as f:
    f.write(json_str)

cred = credentials.Certificate('packages/model/firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': env_vars['DATABASE_URL']
})

fall_ref = db.reference('/fall')

address = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

def wearable():
    print("Wearable has detected a fall!")

q = queue.Queue()
accelerometer_queue = queue.Queue()
stop_ble_reading_event = asyncio.Event()

async def find_bluetooth_device(target_address):
    devices = await bleak.BleakScanner.discover()
    for device in devices:
        if device.address == target_address:
            return device.address
    return None

# loop = asyncio.get_event_loop()

try:
    loop = asyncio.get_running_loop()
except RuntimeError:  # No running event loop
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

device_address = loop.run_until_complete(find_bluetooth_device(address))

async def read_characteristic(client, char_uuid):
    char_value = await client.read_gatt_char(char_uuid)
    return char_value

fall_detected = False

async def read_characteristics(address, stop_event):
    async with BleakClient(address) as client:
        while not stop_event.is_set():
            try:
                char_values = await asyncio.gather(
                    read_characteristic(client, CHAR_UUID)
                )
                value = struct.unpack('<i', char_values[0])[0]
                if (value == 1):
                    print("Wearable fall detected!")
                    fall_detected = True
                fall_detected = False
                # print(fall_detected)
                accelerometer_queue.put(fall_detected)
            except Exception as e:
                print(f"Error: {e}")
            await asyncio.sleep(0.1)

def read_accel_data(address):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(read_characteristics(address, stop_ble_reading_event))

if device_address:
    print(f"Bluetooth device found at {device_address}")
    accelerometer_thread = threading.Thread(target=read_accel_data, args=(device_address,))
    accelerometer_thread.start()
# else:
    # print("Bluetooth device not found")

env_vars = dotenv_values()

PRIV_KEY = env_vars["PRIV_KEY"]

<<<<<<< HEAD
url = 'http://localhost:5000/api/fall'  

# scheduled to run on GPU by default
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
weights = torch.load('packages/model/ST-FALL (large).pt', map_location=torch.device('cpu'))    
=======
url = env_vars["BACKEND_URL"]  

# scheduled to run on GPU by default
device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
weights = torch.load('packages/model/ST-FALL (large).pt', map_location=torch.device('cpu'), weights_only=False)    
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
model = weights['model']
model = model.half().to(device)
_ = model.eval()

video_path = "packages/model/fall.mp4"
cap = cv2.VideoCapture(video_path)

if (cap.isOpened() == False):
    print('Error while trying to read video. Please check path again')

frame_width = int(cap.get(3))
print(frame_width)
frame_height = int(cap.get(4))
print(frame_height)
frame_count = 0

fallen = False
sent = False
last_sent_time = None

stop_request_event = threading.Event()

def post_request():
    global last_sent_time
    now = datetime.now()
    while not stop_request_event.is_set():
        item = q.get()
        if item is None:
            break

        if last_sent_time is None or (now - last_sent_time >= timedelta(seconds=30)):
            prediction_data, buffer = item
            if accelerometer_queue.qsize() > 0:
                accelerometer_data = accelerometer_queue.get()
                prediction_data['accelerometer_data'] = accelerometer_data
                prediction_data_json = json.dumps(prediction_data)
            else:
                prediction_data_json = json.dumps(prediction_data)

            in_memory_file = BytesIO(buffer)
            files = {'file': ('current_frame.jpg', in_memory_file, 'image/jpeg')}
            data = {
                'PREDICTION_DATA': prediction_data_json,
                'USERNAME': 'ab7zz',
                'PRIV_KEY': PRIV_KEY,
                'DEVICE_ID': 1234
            }

            response = requests.post(url, files=files, data=data)

            if response.status_code == 200:
                print("Request sent successfully.")
                res = json.loads(response.text)
                print(f"Data IPFS ID: {res['dataIPFSid']}")
                print(f"Image IPFS ID: {res['imgIPFSid']}")
                print(f"Transaction Hash: {res['txHash']}")
                last_sent_time = now
            else:
                print("Error:", response.status_code)

        q.task_done()

    q.task_done()

request_thread = threading.Thread(target=post_request)
request_thread.start()

while(cap.isOpened):
    
    frame_count += 1  
    ret, frame = cap.read()
    if not ret:
        break
    if ret:
        
        orig_image = frame
        
        image = cv2.cvtColor(orig_image, cv2.COLOR_BGR2RGB)
        image = letterbox(image, (frame_width), stride=64, auto=True)[0]
        image_ = image.copy()
        image = transforms.ToTensor()(image)
        image = torch.tensor(np.array([image.numpy()]))
        
        image = image.half().to(device)
        
        with torch.no_grad():
            output, _ = model(image)

        output = non_max_suppression(output, 0.25, 0.65, nc=model.yaml['nc'], nkpt=model.yaml['nkpt'], kpt_label=True)
        output = output_to_target(output)
        im0 = image[0].permute(1, 2, 0) * 255
        im0 = im0.cpu().numpy().astype(np.uint8)
        
        im0 = cv2.cvtColor(im0, cv2.COLOR_RGB2BGR)
        for idx in range(output.shape[0]):
            left_shoulder_y= output[idx][23]
            left_shoulder_x= output[idx][22]
            right_shoulder_y= output[idx][26]
            
            left_body_y = output[idx][41]
            left_body_x = output[idx][40]
            right_body_y = output[idx][44]

            len_factor = math.sqrt(((left_shoulder_y - left_body_y)**2 + (left_shoulder_x - left_body_x)**2 ))

            left_foot_y = output[idx][53]
            right_foot_y = output[idx][56]
            
            if left_shoulder_y > left_foot_y - len_factor and left_body_y > left_foot_y - (len_factor / 2) and left_shoulder_y > left_body_y - (len_factor / 2):
              fallen = True
              print("Camera has detected a fall!")
            #   wearable()
              if fallen and not sent:
                now = datetime.now()
                timestamp = now.strftime('%H:%M:%S')
                date = now.strftime('%d-%m-%Y')
                _, buffer = cv2.imencode('.jpg', im0)
                prediction_data = {
<<<<<<< HEAD
                  'username': 'ALOSH',
=======
                  'username': 'ABHINAV C V',
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
                  'timestamp': timestamp,
                  'date': date,
                  'status': 'fallen',
                }

                fall_ref.set(prediction_data)

                q.put((prediction_data, buffer))

                sent = True
            else:
               sent = False
               fallen = False
        cv2.imshow('image', im0)
        cv2.waitKey(1)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    else:
        break

cap.release()
cv2.destroyAllWindows()

stop_ble_reading_event.set()
if device_address:
    accelerometer_thread.join()
    stop_request_event.set()
else:
    stop_request_event.set()
q.put(None)
request_thread.join()