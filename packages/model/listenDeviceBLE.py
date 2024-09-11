from bleak import BleakClient, BleakError
import threading
import queue
from datetime import datetime
import asyncio
import requests
import json
import cv2
from io import BytesIO
from dotenv import dotenv_values
import firebase_admin
from firebase_admin import credentials, db

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

PRIV_KEY = env_vars["PRIV_KEY"]
ADDRESS = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

AUTH_KEY_CHAR_UUID = "12345678-1234-5678-9abc-def012345680"

url = env_vars["BACKEND_URL"]  

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