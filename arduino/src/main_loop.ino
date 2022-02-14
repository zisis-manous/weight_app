/*
Main loop of our arduino sim7000 scale.
The scale's output is aplified with an HX711 amplifier and fed in the arduino's digital input
A pressure sensor is implemented for the scale's press mode, its signal is fed in the interrupt input 0
GNS is used to get the scale's current position
All data is to our publicly hosted website : https://weight-app-g2.herokuapp.com/.
The user can change the scale's operation on the website

*/
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

SoftwareSerial mySerial(11, 10); // RX, TX

char response[500];//contains commands responses

// HTTP POST Request parameters
int deviceId = 1;
double weight;
float lat;
float lon;
String datetime;
String password = "arduino";

boolean pdp_deact_flag = 0;//deattachment flag

//Device operation mode parameters
int on_off = 1; //if scale is on
int mode = 0; //scale's operation mode
int exec_time = 0; //stores time to send data, used to calculate delay time on regular mode
int timestart = 0;

// press mode parameters
const int buttonPin = 2; // the number of the pushbutton pin
int pressed=0; //if an item was placed on the scale during press mode

//Scale parameters
#include <HX711_ADC.h>

const int HX711_dout = 4; //mcu > HX711 dout pin
const int HX711_sck = 5; //mcu > HX711 sck pin
HX711_ADC LoadCell(HX711_dout, HX711_sck);

unsigned long stabilizingtime = 2000; // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
boolean _tare = true; //set this to false if you don't want tare to be performed in the next step
float calibrationValue = 382.85; //calibration value
unsigned long t = 0;

//JSON parsing
StaticJsonDocument<256> states; //used to deserialize device state json 

void setup()  
{
  // Open serial communications and wait for port to open:
  Serial.begin(19200);
  mySerial.begin(19200);
  delay(100);

  //interrupt for press mode
  pinMode(buttonPin, INPUT);
  // Attach an interrupt to the ISR vector
  attachInterrupt(0, weight_on_scale, RISING);

  //initialize scale
  LoadCell.begin();
  LoadCell.start(stabilizingtime, _tare);
  LoadCell.setCalFactor(calibrationValue);
  Serial.println("Scale startup is complete\n");

  //setupSIM();
  connectGPRS();//Configure bearer
  Serial.println("GPRS startup is complete\n");
  getGPSsignal();
  Serial.println("GPS Signal acquired\n");
}


void loop()
{
  timestart = millis(); //get current time
  GetDeviceState(); //GET request to get device's state as JSON
  
  on_off = states["devices"][1]["is_on"]; //find out if device is on
  int sample_rate = states["devices"][1]["sample_rate"]; //find out device's sample rate
  mode = states["devices"][1]["mode"]; //find out device's operation mode

  

  if(on_off){ //if device is on
    if(mode == 0){//regular mode
      weight = getWeight(); //get weight from scale
      measure(weight); //POST data to API
      exec_time = millis() - timestart; //find out time needed to execute the loop
      Serial.println(String(exec_time));
      delay(1000*sample_rate - exec_time); //set delay appropriately to satisfy sample rate constraint
    }
    else if(mode == 1){//psm mode
      Serial.println("psm_mode");
    }
    
    else if(mode == 2){//press mode
      Serial.println("press_mode");
      if(pressed){ //if item is put on scale
        weight = getWeight(); //find its weight
        measure(weight); //POST data to API
        pressed = 0; //set item on scale flag as 0
        delay(100);
        }
      }
    }
  
  
}

void setupSIM(){
  mySerial.println("AT+IPR=19200"); //set baud rate
  delay(100);
  updateSerial();

  mySerial.println("AT+CGMM"); //module model
  delay(100);
  updateSerial();

  mySerial.println("AT+CGMR"); //firmware version
  delay(100);
  updateSerial();

  mySerial.println("AT+CGSN"); //imei code
  delay(100);
  updateSerial();

  mySerial.println("AT+CMNB=2"); //preferred order NB-IoT
  delay(100);
  updateSerial();

  mySerial.println("AT+CNMP=2"); //preffered mode selection automatic
  delay(100);
  updateSerial();

  mySerial.println("AT+CBANDCFG=\"NB-IOT\",20"); //select band
  delay(100);
  updateSerial();

  mySerial.println("AT+COPS=?"); //available networks
  delay(200000);
  updateSerial();

  mySerial.println("AT+COPS=1,2,\"20205\""); //1nce roaming with vodafone
  delay(100);
  updateSerial();

  mySerial.println("AT+CLTS=1"); //receive network time updating
  delay(100);
  updateSerial();

  mySerial.println("AT+CGATT=1"); //attatch to gprs
  delay(100000);
  updateSerial();

  mySerial.println("AT+CSQ"); //signal strength
  delay(100);
  updateSerial();
}

float getWeight(){
  float w = 0; //stores weight
  float cumsum=0; //cumulative sum to get smoothed weight
  for(int j=0;j<100;j++){ //get 100 measurements for better accuracy
    static boolean newDataReady = 0;
    const int serialPrintInterval = 0; //increase value to slow down serial print activity
  
    // check for new data/start next conversion:
    if (LoadCell.update()) newDataReady = true;
  
    // get smoothed value from the dataset:
    if (newDataReady) {
      if (millis() > t + serialPrintInterval) {
        w = LoadCell.getData();
        newDataReady = 0;
        t = millis();
      }
    }
    if(j>89) cumsum += w; //add last 10 samples
    delay(30);
  }
  return cumsum/10.0; //return smoothed weight
}

void weight_on_scale(){ //ISR for when item on scale
  if(mode==2){
    Serial.println("\n PRESSED\n");
    pressed = 1; //activate item on scale flag
  }
}

void measure(float weight){
  getScalePosition();
  getDate();
  PostData("{\"password\":\"" + password + "\",\"device_id\":" + deviceId + ",\"weight\":"+weight+",\"lang\":" + String(lat,6) + ",\"long\":" + String(lon,6) + ",\"date_time\":\"" + datetime + "\"}");

}

void getDate(){ //receive current datetime from network time updating
  mySerial.println("AT+CCLK?");
  delay(100);
  updateSerial();
  datetime = "20"+String(response).substring(19,36); //slice response to get datetime information
  datetime.replace('/','-');
  datetime.replace(',',' ');
}

void getGPSsignal(){
  mySerial.println("AT+CGNSPWR=1"); //power GPS on
  delay(100);
  updateSerial();

  while(1){
    mySerial.println("AT+CGNSINF"); //check NMEA GPS status
    delay(100);
    updateSerial();
    if( String(response).substring(25,26) == String("1")){ break;} //if connection is established exit
    delay(1000);
  }
}

void getScalePosition(){
    mySerial.println("AT+CGNSINF"); //Get NMEA
    delay(100);
    updateSerial();

    //Slice NMEA to get scale map coordinates
    lat = String(response).substring(46,55).toFloat();
    lon = String(response).substring(56,65).toFloat();
  
}


void connectGPRS()
{
  mySerial.println("AT+CGATT?"); //check if network attached
  delay(1000);
  updateSerial();
                                           
  mySerial.println("AT+SAPBR=3,1,\"APN\",\"iot.1nce.net\""); //configure bearer profile 
  delay(1000);
  updateSerial();

  mySerial.println("AT+SAPBR=1,1"); //Open bearer
  delay(1000);
  updateSerial();

  mySerial.println("AT+SAPBR=2,1"); //Query bearer
  delay(1000);
  updateSerial();
}

void GetDeviceState(){ 
  mySerial.println("AT+HTTPINIT"); //Init HTTP service
  delay(200);
  updateSerial();

  mySerial.println("AT+HTTPPARA=\"CID\",1"); //Set parameters for HTTP session
  delay(200);
  updateSerial();                                            

  mySerial.println("AT+HTTPPARA=\"URL\",\"http://weight-app-g2.herokuapp.com/devices_data\""); //Set URL
  delay(200);
  updateSerial();

  mySerial.println("AT+HTTPACTION=0"); //Start GET session
  delay(3000);
  updateSerial();

  mySerial.println("AT+HTTPREAD"); //Read API response
  delay(200);
  updateSerial();

  //Deserialize json
  String res = String(response);
  String res_json = res.substring(res.indexOf("{"),1+res.lastIndexOf("}"));
  int json_len = res_json.length()+1;
  char res_json_array[json_len];
  res_json.toCharArray(res_json_array,json_len);
  deserializeJson(states, res_json_array);
  
  mySerial.println("AT+HTTPTERM"); //Terminate HTTP service
  delay(200);
  updateSerial();
}


 void PostData(String data)
{
  mySerial.println("AT+HTTPINIT"); //Init HTTP service
  delay(200);
  updateSerial();

  mySerial.println("AT+HTTPPARA=\"CID\",1"); //Set parameters for HTTP session
  delay(200);
  updateSerial();                                            

  mySerial.println("AT+HTTPPARA=\"URL\",\"http://weight-app-g2.herokuapp.com/add_weight\""); //Set URL
  delay(200);
  updateSerial();

  mySerial.println("AT+HTTPPARA=\"CONTENT\",\"application/json\""); //Set content to be sent as JSON
  delay(200);
  updateSerial();

  mySerial.println("AT+HTTPDATA=" + String(data.length()) + ",10000"); //Post data, data size has to be included in the command
  Serial.println(data);
  delay(200);
  updateSerial();

  mySerial.println(data); //JSON in string format that we want to send
  delay(200);
  updateSerial();
  
  mySerial.println("AT+HTTPACTION=1"); //Start POST session
  delay(2000);
  updateSerial();

  mySerial.println("AT+HTTPREAD"); //Read server response
  delay(200);
  updateSerial();

  mySerial.println("AT+HTTPTERM"); //Terminate HTTP service
  delay(200);
  updateSerial();

  if(pdp_deact_flag>0){ //if pdp_flag is active a disconnection from the bearer has occured
    connectGPRS(); //repoen bearer
    pdp_deact_flag = 0; //deactivate flag
  } 
}


void updateSerial()
{
  delay(100);
  int i=0;
  while(mySerial.available()>0) //if there is data sent by sim to Arduino
  {
    char res = mySerial.read(); //read character on serial
    response[i++] = res; //save response
    Serial.write(res);//Forward what Software Serial received to Serial Port
  }
  response[i]='\0';//string terminating character
  if(String(response).indexOf("+SAPBR 1: DEACT") > 0){ //Check if response contains deattachment error message
    Serial.println("\n DEATTACHED\n");
    pdp_deact_flag = 1;
  }
}
