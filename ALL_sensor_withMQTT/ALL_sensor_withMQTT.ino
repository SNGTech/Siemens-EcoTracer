
#include <EmonLib.h> //Include the EmonLib library for voltage measurement
#include <WiFi.h>
#include <PubSubClient.h>

#include <FastLED.h>
#include <Adafruit_ADS1X15.h>
Adafruit_ADS1115 ads;

#define LED_PIN 13
#define NUM_LEDS 19
CRGB leds[NUM_LEDS];

const int LIQUID_SENSOR_PIN = 26; //YFS201 Sensor connected to Pin 26 of ESP32 for Liquid Flow
const int AIR_SENSOR_PIN = 4;    //YFS201 Sensor connected to Pin 4 of ESP32 for Air Flow
const int VOLTAGE_SENSOR_PIN = 35; //ZMPT101B AC Voltage Sensor connected to Pin 34 of ESP32

const char *ssid = "linksys";
const char *password = "";
const char *mqtt_broker = "192.168.1.101";
const int mqtt_port = 1883;
const char *mqtt_user = "";
const char *mqtt_password = "";

const float FACTOR = 30;
const float multiplier = 0.00010;

bool eventTrigger = false;  //Declare and initialise eventTrigger variable

volatile int liquidPulseCount = 0;
volatile int airPulseCount = 0;

unsigned long lasttimer1 = 0;
unsigned long lasttimer2 = 0;
unsigned long lastTime = 0;
float liquidFlowRate = 0.0;

float liquidTotalVolume = 0.0;
float airTotalVolume = 0.0;
float airFlowRate = 0.0;

EnergyMonitor emon1; //Create an instance of the EnergyMonitor class

WiFiClient espClient;
PubSubClient client(espClient);

float energy = 0.0;
float power = 0.0;
float energyconsumption = 0.0;
float carbonRate = 0.0;

void IRAM_ATTR liquidPulseCounter() {
  liquidPulseCount++;
}
void IRAM_ATTR airPulseCounter() {
  airPulseCount++;
}

void setup() {
  Serial.begin(9600);
  pinMode(LIQUID_SENSOR_PIN, INPUT_PULLUP);
  pinMode(AIR_SENSOR_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(LIQUID_SENSOR_PIN), liquidPulseCounter, RISING);
  attachInterrupt(digitalPinToInterrupt(AIR_SENSOR_PIN), airPulseCounter, RISING);

  emon1.voltage(VOLTAGE_SENSOR_PIN, 153, 1.7); //Voltage: input pin, calibration, phase_shift
  startup();
  FastLED.addLeds<WS2813, LED_PIN, GRB>(leds, NUM_LEDS);
  FastLED.show(); //Initialise LEDs to the initial color

  ads.setGain(GAIN_FOUR);
  ads.begin();

  //Set initial total volume values to zero
  liquidTotalVolume = 0.0;
  airTotalVolume = 0.0;
  airFlowRate = 0.0;
  liquidFlowRate = 0.0;

  client.setServer(mqtt_broker, mqtt_port);
  client.setBufferSize(1000);
  reconnect();
}

void loop() {
  while(client.connected()) {
    unsigned long currentTime = millis();
    unsigned long elapsedTime = currentTime - lastTime;
    
    if (elapsedTime >= 1000) {
      emon1.calcVI(25, 1000); //Calculate Voltage and Current RMS values
      // FIX CURRENT
      float currentRMS = 0; //getcurrent();
      float supplyVoltage = emon1.Vrms;

      detachInterrupt(digitalPinToInterrupt(LIQUID_SENSOR_PIN));
      detachInterrupt(digitalPinToInterrupt(AIR_SENSOR_PIN));

      float liquidVolume = liquidPulseCount * 0.006; //Each pulse represents 2 mL (adjust according to sensor specifications)
      liquidTotalVolume += liquidVolume / (elapsedTime / 1000.0) * 60.0 / 1000.0;

      float airVolume = airPulseCount * 2.0; //Each pulse represents 2 mL (adjust according to sensor specifications)
      airTotalVolume += airFlowRate;

      airFlowRate = airPulseCount * 1.97 / (elapsedTime / 1000.0) * 60.0 / 1000.0; //Convert mL/s to L/min
      float liquidFlowRate = liquidPulseCount * 0.012 / (elapsedTime / 1000.0) * 60.0 / 1000.0; //Convert mL/s to L/min

      Serial.print("Voltage: ");
      Serial.print(supplyVoltage);
      Serial.print(" V\t");

      // Serial.print(" Current: ");
      // Serial.print(currentRMS);
      // Serial.print(" A\n");

      Serial.print("Liquid Flow Rate: ");
      Serial.print(liquidFlowRate);
      Serial.print(" L/min\t");

      Serial.print("Liquid Total Volume: ");
      Serial.print(liquidTotalVolume);
      Serial.print(" L\n");  
      
      Serial.print("Air Flow Rate: ");
      Serial.print(airFlowRate);
      Serial.print(" L/min\t");

      Serial.print("Air Total Volume: ");
      Serial.print(airTotalVolume);
      Serial.print(" L");

      Serial.println("\n");


      liquidPulseCount = 0;
      airPulseCount = 0;
      lastTime = currentTime;

      attachInterrupt(digitalPinToInterrupt(LIQUID_SENSOR_PIN), liquidPulseCounter, RISING);
      attachInterrupt(digitalPinToInterrupt(AIR_SENSOR_PIN), airPulseCounter, RISING);

      // Calculate power & energy
      //power = supplyVoltage * currentRMS;
      energy = (power / 1000) * 1;
      energyconsumption = (power / 1000) * 24;
      carbonRate = energy * 0.4057;
      
      //Publish Readings to MQTT Topics
      char buffer[6][50];

      snprintf(buffer[0], 50, "%.2f", liquidFlowRate);
      snprintf(buffer[1], 50, "%.2f", liquidTotalVolume);
      snprintf(buffer[2], 50, "%.2f", airFlowRate);
      snprintf(buffer[3], 50, "%.2f", supplyVoltage);
      snprintf(buffer[4], 50, "%.2f", currentRMS);
      snprintf(buffer[5], 50, "%.2f", airTotalVolume);

      String jsonStr = "{ \"liquidFlowRate\": " + String(buffer[0]) + ", \"liquidTotalVolume\": " + String(buffer[1]) + ", \"airFlowRate\": " + String(buffer[2]) + ", \"supplyVoltage\": " + String(buffer[3]) + ", \"currentRMS\": " + String(buffer[4]) + ", \"airTotalVolume\": " + String(buffer[5]) + " }";
      char jsonCharArr[200];
      jsonStr.toCharArray(jsonCharArr, 200);
      
      client.publish("ecotracer/data", jsonCharArr);
      Serial.println(jsonCharArr);
      
    }
  }
    //checkliquidstability();
  //checkairstability();
  Serial.println("Disconnected. Attempting to reconnect...");
  reconnect();
}
/*
void checkliquidstability() {
  unsigned long timer1 = millis();
  unsigned long timer1time = timer1 - lasttimer1;

  if (timer1time >= 10000) {
    if (liquidFlowRate < 0.20 && eventTrigger == false) {
      eventTrigger = true;
      waterRed();
    //  Blynk.logEvent("liquid_leakage", "Check For Liquid Leakage");
    } else if (liquidFlowRate >= 0.20) {
        eventTrigger = false;
        startup();
    }
    lasttimer1 = timer1;
}
}

void checkairstability() {
  unsigned long timer2 = millis();
  unsigned long timer2time = timer2 - lasttimer2;

  if (timer2time >= 10000) {
    if (airFlowRate < 60 && eventTrigger == false) {
      eventTrigger = true;
      airRed();
     // Blynk.logEvent("air_leakage", "Check For Air Leakage");
    } else if (airFlowRate >= 60) {
        eventTrigger = false;
        startup();
    }
    lasttimer2 = timer2;
}
}
*/
void setLEDsInRange(int start, int end, CRGB color) {
  for (int brightness = 0; brightness <= 255; brightness++) {
    for (int i = start; i <= end; i++) {
      leds[i] = color;
      leds[i].fadeToBlackBy(255 - brightness); // Simulate fading effect
    }
    FastLED.show();
    delay(10); // Delay between brightness steps
  }
}

void startup() {
  setLEDsInRange(0, 17, CRGB::Blue);
  delay(500); // Delay between color changes
}
/*
void waterRed() {
  setLEDsInRange(0, 5, CRGB::Red);
  setLEDsInRange(6, 11, CRGB::Blue);
  setLEDsInRange(12, 17, CRGB::Blue);
  delay(500); // Delay between color changes
}

void airRed() {
  setLEDsInRange(0, 5, CRGB::Blue);
  setLEDsInRange(6, 11, CRGB::Red);
  setLEDsInRange(12, 17, CRGB::Blue);
  delay(500); // Delay between color changes
}

void enegryRed() {
  setLEDsInRange(0, 5, CRGB::Blue);
  setLEDsInRange(6, 11, CRGB::Blue);
  setLEDsInRange(12, 17, CRGB::Red);
  delay(500); // Delay between color changes
}
*/
float getcurrent() {
  float voltage1;
  float current;
  float sum = 0;
  long time_check = millis();
  int counter = 0;

  while (millis() - time_check < 1000) {
    voltage1 = ads.readADC_Differential_0_1() * multiplier;
    current = voltage1 * FACTOR;
    sum += sq(current);
    counter = counter + 1;
  }
  current = sqrt(sum / counter);
  return current;
}

void reconnect() {
//Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to WiFi network.");

  //Connect to MQTT broker
  while (!client.connected()) {
    if (client.connect("ESP32Client", mqtt_user, mqtt_password)) {
      Serial.println("Connected to MQTT Broker");
    } else {
      Serial.print("Failed to connect to MQTT Broker, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}