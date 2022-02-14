
/*
Simple example of our pressure sensor operation.
When pressure is applied the sensor acts as a switch and pulls voltage of the interrupt pin to high
*/

const int buttonPin = 2;     // the number of the pushbutton pin

void setup() {
  // initialize the pushbutton pin as an input:
  Serial.begin(19200);
  pinMode(buttonPin, INPUT);
  // Attach an interrupt to the ISR vector
  attachInterrupt(0, pin_ISR, RISING);
}

void loop() {
  // Nothing here!
}

void pin_ISR() {
  Serial.println("PRESSED");
}
