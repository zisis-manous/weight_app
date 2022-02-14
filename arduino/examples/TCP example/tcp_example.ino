/*
Simple demonstration of TCP communication with sim7000.
Random floats are send to our public ThingSpeak IoT analytics service channel.
https://thingspeak.com/channels/1618936
*/

#include <SoftwareSerial.h>

SoftwareSerial mySerial(11, 10); // RX, TX
char response[500]; //contains command responses


void setup()  
{
  // Open serial communications and wait for port to open, make sure both Serial and SIM7000 baudrates are the same with the AT command AT+IPR=19200:
  Serial.begin(19200);
  mySerial.begin(19200);
  delay(100);

}


void loop()
{  
  double weight = random(1, 500) / 100.0; //random float between 0,50 to be sent
  while(1){ //making sure TCP connection is set up properly
    if(ConnectTCP()) break;
  }
  Send((String)"GET https://api.thingspeak.com/update?api_key=REG2BIGQ4QGV5PJ2&field1="+weight); //send the value to the thingspeak channel
  delay(5000);
}

 void Send(String data)
{
  mySerial.println("at+cipsend");// AT command to send data
  delay(100);
  updateSerial();
  mySerial.println(data);// The text you want to send
  delay(100);
  updateSerial();
  mySerial.println((char)26);// Ctrl+z character to end data sending
  delay(100);
  updateSerial();
}

int ConnectTCP(){
  //Based on the TCP state diagram found in the sim7000 TCP Application manual
  while(true){
    mySerial.println("at+cipstatus");//AT command to get TCP status
    delay(1000);
    updateSerial();
    String res = String(response);//Get cipstatus response and according to the status send the appropriate at command to setup communication
    
    if((res.indexOf("PDP DEACT")>0) || (res.indexOf("TCP CLOSED")>0)){
      mySerial.println("at+cipshut");
      delay(2000);
      updateSerial();
    }

    else if(res.indexOf("IP START")>0){
      mySerial.println("at+ciicr");
      delay(2000);
      updateSerial();
    }

    else if(res.indexOf("IP INITIAL")>0){
      mySerial.println("at+cstt=\"iot.1nce.net\"");
      delay(500);
      updateSerial();
    }

    else if(res.indexOf("IP GPRSACT")>0){
      mySerial.println("at+cifsr");
      delay(500);
      updateSerial();
    }

    else if(res.indexOf("IP STATUS")>0){
      mySerial.println("at+cipstart=\"TCP\",\"api.thingspeak.com\",\"80\"");
      delay(5000);
      updateSerial();
    }

    else if(res.indexOf("CONNECT OK")>0){
      updateSerial();
      return 1;
    } 
  }
}

void updateSerial()
{
  delay(500);
  int i=0;
  while(mySerial.available()>0)  //if there is data sent by sim to Arduino
  {
    char res = mySerial.read(); //read character on serial
    response[i++] = res; //save response
    Serial.write(res);//Forward what Software Serial received to Serial Port
  }
  response[i]='\0';//string terminating character
}
