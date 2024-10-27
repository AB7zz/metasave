<<<<<<< HEAD
from bleak import BleakClient, BleakError
import threading
import queue
from datetime import datetime
import asyncio
import requests
import json
import cv2
from io import BytesIO
=======
import asyncio
from bleak import BleakClient
import serial
import threading
import requests
import json
from datetime import datetime
from io import BytesIO
import cv2
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
from dotenv import dotenv_values
import firebase_admin
from firebase_admin import credentials, db

<<<<<<< HEAD
env_vars = dotenv_values()

=======
# Load environment variables
env_vars = dotenv_values()

# Firebase setup
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
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
<<<<<<< HEAD

PRIV_KEY = env_vars["PRIV_KEY"]
ADDRESS = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

AUTH_KEY_CHAR_UUID = "12345678-1234-5678-9abc-def012345680"

url = 'http://localhost:5000/api/fall'  

stop_ble_reading_event = asyncio.Event()

q = queue.Queue()

async def read_characteristics(address, stop_event):
    async with BleakClient(address) as client:
        # while not stop_event.is_set():
        while not stop_event.is_set():
            print('trying to read')
            try:
                char_values = await client.read_gatt_char(CHAR_UUID)
                auth_values = await client.read_gatt_char(AUTH_KEY_CHAR_UUID)
                int_value = int(char_values[0])
                print(int_value, auth_values.decode())
                if (int_value == 49):
                    print("Fallen")
                    now = datetime.now()
                    timestamp = str(int(now.timestamp()))
                    date = now.strftime('%d-%m-%Y')

                    auth_key = auth_values.decode()

                    prediction_data = {
                        'username': 'ab7zz',
                        'timestamp': timestamp,
                        'date': date,
                        'status': 'fallen'
                    }

                    fall_ref.set(prediction_data)

                    im0 = cv2.imread("fall.jpg")
                    _, buffer = cv2.imencode('.jpg', im0)
                    prediction_data_json = json.dumps(prediction_data)

                    in_memory_file = BytesIO(buffer)
                    files = {'file': ('current_frame.jpg', in_memory_file, 'image/jpeg')}
                    data = {
                        'PREDICTION_DATA': prediction_data_json,
                        'USERNAME': 'ab7zz',
                        'PRIV_KEY': auth_key,
                        'DEVICE_ID': 5678,
                    }

                    response = requests.post(url, files=files, data=data)

                    if response.status_code == 200:
                        print("Request sent successfully.")
                        res = json.loads(response.text)
                        print(f"Data IPFS ID: {res['dataIPFSid']}")
                        print(f"Image IPFS ID: {res['imgIPFSid']}")
                        print(f"Transaction Hash: {res['txHash']}")
                    else:
                        print("Error:", response.status_code)
            except Exception as e:
                print(f"Error: {e}")
            await asyncio.sleep(0.1)

def read_accel_data(address):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(read_characteristics(address, stop_ble_reading_event))

accelerometer_thread = threading.Thread(target=read_accel_data, args=(ADDRESS,))
accelerometer_thread.start()

stop_ble_reading_event.set()
accelerometer_thread.join()
=======
url = env_vars["BACKEND_URL"]

# BLE UUID constants
FALL_DETECTION_SERVICE_UUID = "19B10000-E8F2-537E-4F6C-D104768A1214"
FALL_STATUS_CHARACTERISTIC_UUID = "19B10001-E8F2-537E-4F6C-D104768A1214"

# Arduino serial port (adjust as needed)
SERIAL_PORT = "/dev/cu.usbmodem101"  # Change this to match your Arduino's serial port
BAUD_RATE = 9600

# BLE device address (you'll need to replace this with your device's address)
DEVICE_ADDRESS = "E0:F7:BF:E9:2B:7C"  # Replace with your Arduino's BLE address

# Flags to control the loops
ble_running = True
serial_running = True

def handle_fall_detection(source):
    print(f"FALL_DETECTED via {source}")
    now = datetime.now()
    timestamp = str(int(now.timestamp()))
    date = now.strftime('%d-%m-%Y')

    prediction_data = {
        'username': 'ab7zz',
        'timestamp': timestamp,
        'date': date,
        'status': 'fallen'
    }

    fall_ref.set(prediction_data)

    im0 = cv2.imread("packages/model/test/fall.jpg")
    _, buffer = cv2.imencode('.jpg', im0)
    prediction_data_json = json.dumps(prediction_data)

    in_memory_file = BytesIO(buffer)
    files = {'file': ('current_frame.jpg', in_memory_file, 'image/jpeg')}
    data = {
        'PREDICTION_DATA': prediction_data_json,
        'USERNAME': 'ab7zz',
        'PRIV_KEY': env_vars.get("PRIV_KEY", ""),
        'DEVICE_ID': 5678,
    }

    response = requests.post(url, files=files, data=data)

    if response.status_code == 200:
        print("Request sent successfully.")
        res = json.loads(response.text)
        print(f"Data IPFS ID: {res['dataIPFSid']}")
        print(f"Image IPFS ID: {res['imgIPFSid']}")
        print(f"Transaction Hash: {res['txHash']}")
    else:
        print("Error:", response.status_code)

async def notify_callback(sender, data):
    status = data.decode()
    if status == "FALL_DETECTED":
        handle_fall_detection("BLE")
    elif "," in status:
        # This is accelerometer data
        x, y, z = map(float, status.split(","))
        print(f"Accelerometer data (BLE): x={x}, y={y}, z={z}")

async def run_ble():
    while ble_running:
        try:
            async with BleakClient(DEVICE_ADDRESS) as client:
                print("Connected to BLE device")
                await client.start_notify(FALL_STATUS_CHARACTERISTIC_UUID, notify_callback)
                while ble_running and client.is_connected:
                    await asyncio.sleep(1)
        except Exception as e:
            print(f"BLE Error: {e}")
            await asyncio.sleep(5)  # Wait before trying to reconnect

def run_serial():
    while serial_running:
        try:
            with serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1) as ser:
                print("Connected to serial port")
                while serial_running:
                    if ser.in_waiting > 0:
                        line = ser.readline().decode().strip()
                        if line == "FALL_DETECTED":
                            handle_fall_detection("Serial")
                        elif line == "NO_FALL_DETECTED":
                            print("No fall detected (Serial)")
                        else:
                            print(f"Serial data: {line}")
        except Exception as e:
            print(f"Serial Error: {e}")
            threading.Event().wait(5)  # Wait before trying to reconnect

async def main():
    ble_task = asyncio.create_task(run_ble())
    serial_task = asyncio.to_thread(run_serial)
    
    await asyncio.gather(ble_task, serial_task)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Stopping...")
        ble_running = False
        serial_running = False
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
