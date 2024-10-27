import json
import requests
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

with open("firebase_credentials.json", "w") as f:
    f.write(json_str)

cred = credentials.Certificate('firebase_credentials.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': env_vars['DATABASE_URL']
})

fall_ref = db.reference('/fall')

PRIV_KEY = env_vars["PRIV_KEY"]

<<<<<<< HEAD
url = 'http://localhost:5000/api/fall'
=======
url = env_vars["BACKEND_URL"]
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958

prediction_data = { 
    'username': 'ab7zz',
    'timestamp': '12:40pm',
<<<<<<< HEAD
    'date': '16-05-2024',
=======
    'date': '01-09-2024',
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
    'status': 'fallen'
}

fall_ref.set(prediction_data)

prediction_data_json = json.dumps(prediction_data)

<<<<<<< HEAD
file_name = 'fall.jpg'
=======
file_name = 'packages/model/test/fall.jpg'
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958
try:
    with open(file_name, 'rb') as f:
        files = {'file': (file_name, f.read())}
        data = {
            'PREDICTION_DATA': prediction_data_json,
            'USERNAME': 'ab7zz',
            'PRIV_KEY': PRIV_KEY,
            'DEVICE_ID': 5678
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
except FileNotFoundError:
    print(f"File not found: {file_name}")
except Exception as e:
    print(f"An error occurred: {e}")



