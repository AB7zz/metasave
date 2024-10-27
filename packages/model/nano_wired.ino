#include <Arduino_LSM9DS1.h>

bool lastState = false;

void setup() {
  Serial.begin(9600);
  while (!Serial);
  Serial.println("Started");

  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }

  Serial.println("IMU initialized");
}

void loop() {
  float x, y, z;

  if (IMU.accelerationAvailable()) {
    IMU.readAcceleration(x, y, z);

    Serial.println("NO_FALL_DETECTED");


    bool currentState = (abs(x) >= 1.5 && abs(y) >= 1.5) || 
                        (abs(y) >= 1.5 && abs(z) >= 1.5) || 
                        (abs(z) >= 1.5 && abs(x) >= 1.5);

    if (currentState != lastState && currentState) {
      Serial.println("FALL_DETECTED");
      lastState = currentState;
    } else {
      Serial.println("NO_FALL_DETECTED");
      lastState = currentState;
    }
    
  }
  
  delay(100);  // Small delay to avoid flooding serial
}