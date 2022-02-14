/*
Simple script for sending at commands to the sim7000 via the arduino serial monitor
*/
#include <SoftwareSerial.h>

SoftwareSerial mySerial(11, 10); // RX, TX
const int SleepPin = 6;       
const int PowerPin = 7;

void setup()  
{
  //pinMode(SleepPin,OUTPUT);
  pinMode(PowerPin,OUTPUT);
  //digitalWrite(SleepPin,LOW); // let DTR in pull-UP
  digitalWrite(PowerPin,LOW); // Keep PowerKey high
  delay(1000);


  // Open serial communications and wait for port to open:
  Serial.begin(19200);
  mySerial.begin(19200);

}

void loop() //write and respond to AT commands via serial monitor
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
