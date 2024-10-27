import serial
import threading
import queue
from datetime import datetime
import requests
import json
import cv2
from io import BytesIO
from dotenv import dotenv_values
import firebase_admin
from firebase_admin import credentials, db

# Load environment variables
env_vars = dotenv_values()

# Firebase setup
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

# Serial port configuration
serial_port = '/dev/cu.usbmodem101'  # Replace with your port
baud_rate = 9600       # Must match the baud rate in the Arduino sketch

url = env_vars["BACKEND_URL"]

stop_serial_reading_event = threading.Event()

def read_serial_data():
    try:
        with serial.Serial(serial_port, baud_rate, timeout=1) as ser:
            print(f"Connected to {serial_port} at baud rate {baud_rate}")

            while not stop_serial_reading_event.is_set():
                line = ser.readline().decode('utf-8').strip()
                print(line)
                if line:
                    print(line)
                    if line == "FALL_DETECTED":
                        print("Fall detected!")
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

    except serial.SerialException as e:
        print(f"Serial Error: {e}")
    except Exception as e:
        print(f"Error: {e}")

def stop_reading():
    stop_serial_reading_event.set()

# Start reading serial data in a separate thread
serial_thread = threading.Thread(target=read_serial_data)
serial_thread.start()

# Stop reading after some time (e.g., 60 seconds) or based on some condition
# You can set a condition or a timeout here
# time.sleep(60)  # Uncomment if you want to stop after 60 seconds
# stop_reading()
# serial_thread.join()
