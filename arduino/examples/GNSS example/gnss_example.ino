/*
Simple demonstration of GNSS with sim7000.
SIM7000 position is returnded in the Serial Monitor
*/

#include <SoftwareSerial.h>

SoftwareSerial mySerial(11, 10); // RX, TX
char response[500];//contains commands responses
float lat;
float lon;

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(19200);
  mySerial.begin(19200);
  delay(100);

  getGPSsignal();
  Serial.println("GPS Signal acquired\n");

}

void loop() {
  getScalePosition();
  Serial.println("LAT:"+lat+" LON:"+lon);

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
}
