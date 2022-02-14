/*
Simple script for setting up SIM7000
*/
#include <SoftwareSerial.h>

SoftwareSerial mySerial(11, 10); // RX, TX

void setup() {
  setupSIM();

}

void loop() // run over and over
{
  if (mySerial.available())
    Serial.write(mySerial.read());
    
  if (Serial.available())
  { 
    while(Serial.available())
    {
      mySerial.write(Serial.read());
    }
    mySerial.println();
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


void updateSerial()
{
  delay(500);
  while(mySerial.available()>0)  //if there is data sent by sim to Arduino
  {
    char res = mySerial.read(); //read character on serial
    Serial.write(res);//Forward what Software Serial received to Serial Port
  }
}
