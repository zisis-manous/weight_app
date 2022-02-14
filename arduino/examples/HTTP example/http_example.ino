/*
Simple demonstration of HTTP communication with sim7000.
Random floats are send to our publicly hosted website : https://weight-app-g2.herokuapp.com/.

In this example the map coordinates are considered constant
*/

#include <SoftwareSerial.h>

SoftwareSerial mySerial(11, 10); // RX, TX

char response[500]; //contains commands responses
boolean pdp_deact_flag = 0; //deattachment flag
// HTTP POST Request parameters
int deviceId = 1;
float lan = 38.234107;
float lon = 21.736136;
String datetime;
String password = "arduino";





void setup()  
{
  // Open serial communications and wait for port to open:
  Serial.begin(19200);
  mySerial.begin(19200);
  delay(100);
  connectGPRS(); //Configure bearer
  Serial.println("GPRS startup is complete\n");
}


void loop()
{
  double weight = random(1, 500) / 10.0;
  //Serial.println(weight);
  getDate();
  Serial.println(datetime);
  PostData("{\"password\":\"" + password + "\",\"device_id\":" + deviceId + ",\"weight\":"+weight+",\"lang\":" + lan + ",\"long\":" + lon + ",\"date_time\":\"" + datetime + "\"}"); //create json string and post it

  if (Serial.available())
  { 
    while(Serial.available())
    {
      mySerial.write(Serial.read());
    }
    mySerial.println();
  }
  delay(10000);
}

void getDate(){ //receive current datetime from network time updating
  mySerial.println("AT+CCLK?");
  delay(100);
  updateSerial();
  datetime = "20"+String(response).substring(19,36); //slice response to get datetime information
  datetime.replace('/','-');
  datetime.replace(',',' ');
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

 void PostData(String data)
{
  mySerial.println("AT+HTTPINIT"); //Init HTTP service
  delay(1000);
  updateSerial();

  mySerial.println("AT+HTTPPARA=\"CID\",1"); //Set parameters for HTTP session
  delay(1000);
  updateSerial();                                            

  mySerial.println("AT+HTTPPARA=\"URL\",\"http://weight-app-g2.herokuapp.com/add_weight\""); //Set URL
  delay(1000);
  updateSerial();

  mySerial.println("AT+HTTPPARA=\"CONTENT\",\"application/json\""); //Set content to be sent as JSON
  delay(1000);
  updateSerial();

  mySerial.println("AT+HTTPDATA=" + String(data.length()) + ",10000"); //Post data, data size has to be included in the command
  Serial.println(data);
  delay(5000);
  updateSerial();

  mySerial.println(data); //JSON in string format that we want to send
  delay(5000);
  updateSerial();
  
  mySerial.println("AT+HTTPACTION=1"); //Start POST session
  delay(5000);
  updateSerial();

  mySerial.println("AT+HTTPREAD"); //Read server response
  delay(1000);
  updateSerial();

  mySerial.println("AT+HTTPTERM"); //Terminate HTTP service
  delay(1000);
  updateSerial();

  if(pdp_deact_flag>0){ //if pdp_flag is active a disconnection from the bearer has occured
    connectGPRS(); //repoen bearer
    pdp_deact_flag = 0; //deactivate flag
  }
}


void updateSerial()
{
  delay(500);
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
