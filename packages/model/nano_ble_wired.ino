#include <Arduino_LSM9DS1.h>
#include <ArduinoBLE.h>

bool lastState = false;

BLEService fallDetectionService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLEStringCharacteristic fallStatusCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", BLERead | BLENotify, 20);

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  Serial.println("IMU initialized");

  // Initialize BLE
  if (!BLE.begin()) {
    Serial.println("Failed to initialize BLE!");
    while (1);
  }

  // Set up the BLE service and characteristic
  BLE.setLocalName("FallDetector");
  BLE.setAdvertisedService(fallDetectionService);
  fallDetectionService.addCharacteristic(fallStatusCharacteristic);
  BLE.addService(fallDetectionService);

  fallStatusCharacteristic.writeValue("NO_FALL_DETECTED");

  // Start advertising
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  BLE.poll();

  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    bool currentState = (abs(x) >= 1.5 && abs(y) >= 1.5) || 
                        (abs(y) >= 1.5 && abs(z) >= 1.5) || 
                        (abs(z) >= 1.5 && abs(x) >= 1.5);

    if (currentState != lastState && currentState) {
      Serial.println("FALL_DETECTED");
      fallStatusCharacteristic.writeValue("FALL_DETECTED");
      lastState = currentState;
    } else {
      Serial.println("NO_FALL_DETECTED");
      fallStatusCharacteristic.writeValue("NO_FALL_DETECTED");
      lastState = currentState;
    }
    
    // Send accelerometer data via BLE
    String accelData = String(x) + "," + String(y) + "," + String(z);
    fallStatusCharacteristic.writeValue(accelData);
  }
  
  delay(100);  // Small delay to avoid flooding serial and BLE
}