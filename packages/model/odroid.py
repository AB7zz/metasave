from flask import Flask, request, jsonify
from flask_cors import CORS
from bleak import BleakClient, BleakError
import json
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

# Create a Flask application
app = Flask(__name__)

# Enable CORS for all routes in the application
CORS(app)

PRIV_KEY = env_vars["PRIV_KEY"]
ADDRESS = "E0:F7:BF:E9:2B:7C"
SERVICE_UUID = "12345678-1234-5678-9abc-def012345678"
CHAR_UUID = "12345678-1234-5678-9abc-def012345679"

<<<<<<< HEAD
url = 'http://localhost:5000/api/fall'
=======
url = env_vars["BACKEND_URL"]
>>>>>>> b08c9e3204e301c000ece0b62c41b7e84b39c958

# Function to send the authentication key using BleakClient
async def send_authentication_key(address, auth_key):
    try:
        async with BleakClient(address) as client:
            if not await client.is_connected():
                await client.connect()
                print("Connected to the Arduino Nano BLE Sense Lite.")
            else:
                print("Already connected to the Arduino Nano BLE Sense Lite.")

            # Check if the key already exists
            existing_key_bytes = await client.read_gatt_char(CHAR_UUID)
            existing_key = existing_key_bytes.decode()
            if existing_key == auth_key:
                print(f"The authentication key '{auth_key}' already exists.")
                print(existing_key)
            else:
                await client.write_gatt_char(CHAR_UUID, auth_key.encode())
                print(f"Sent authentication key '{auth_key}' to the Arduino Nano BLE Sense Lite.")
            # Send the authentication key to the characteristic
            await client.write_gatt_char(CHAR_UUID, auth_key.encode())
            print(f"Sent authentication key '{auth_key}' to the Arduino Nano BLE Sense Lite.")
        
        return True
    
    except BleakError as e:
        print(f"Error during BLE communication: {str(e)}")
        return False

# Define a POST endpoint at /privkey
@app.route('/privkey', methods=['POST'])
async def privkey():
    try:
        # Parse the JSON data from the request body
        data = request.get_json()
        priv_key = data.get('privKey')
        device_type = data.get('type')

        # Check if privKey is provided
        if not priv_key:
            return jsonify({'error': 'Missing privKey in request body'}), 400

        print(f"Received private key '{priv_key}' from the client.")
        
        # Send the authentication key using the send_authentication_key function
        success = await send_authentication_key(ADDRESS, priv_key)
        # success = True

        if success:
            if device_type == '1':
                return jsonify({
                    'message': f'Successfully sent authentication key to the Arduino Nano BLE Sense Lite',
                    'deviceId': 1234
                }), 200
            elif device_type == '2':
                return jsonify({
                    'message': f'Successfully sent authentication key to the Arduino Nano 33 BLE Sense',
                    'deviceId': 5678
                }), 200
        else:
            return jsonify({'error': 'Failed to send authentication key to the Arduino Nano BLE Sense Lite'}), 500

    except Exception as e:
        # Handle any unexpected errors
        print(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=8000)