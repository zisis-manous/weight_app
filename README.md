
# Energy efficient weighing systems

## Arduino and SIM7000G scale.

Our project is the construction on an energy efficient IoT system. We approach energy efficiency in three levels.

1. Energy efficient communication protocols.
2. NB IoT low energy consumption capabilities.
3. Consideration of different use cases.

The hardware and equipment:
* SIM7000G NB-IoT/CAT-M Module
* Arduino Mega 2560
* Weighing Sensor
  - Straing gauge load cell
  - HX711 Amplifier
* Pressure sensor
* GPS Antenna

To execute the sketches, load them via the Arduino IDE to the Arduino using a USB 2.0 to USB 3.0 cable.
More information on the hardware can be found on the wiki https://github.com/fine-just/weight_app/wiki/Hardware

Απλή εφαρμογή υλοποίησης της εφαρμογής ΙoT για Low energy weighting systems
της Ομάδας 2.
Για την ανάπτυξη και διαχείριση της [εφαρμογής](https://weight-app-g2.herokuapp.com/) γίνεται απο την πλατφόρμα `heroku`.
Για να λειτουργήσει η εφαρμογή δεν χρειάζεται κάποια εγκατάσταση αφού μπορεί να βρεθεί στο `https://weight-app-g2.herokuapp.com/`.Λογαριασμος για δοκιμη των λειτουργιών σύνδεσης, email:test@gmail.com ,κωδικός :werty
Απο την ίδια πλατφόρμα χρησιμοποιείται και η βάση δεδομένων `Heroku postgresSQL`.

## Application for Low energy weighting systems
The [application](https://weight-app-g2.herokuapp.com/) is used to control and manage the devices.

## Instructions for running the application locally
The application that works with the device is available at the link `https://weight-app-g2.herokuapp.com/`.
The application uses node.js for `backend` and for `frontend` handlebars,css,javascript is used.
So there should be installed
* [Node.js](https://nodejs.org/en/download/)
* Installing a packet management ,it is recommended [NPM](https://www.npmjs.com/)
* The programming environment should be compatible with the programming languages
- Handlebars
- Css
- Javascript

The packages to be installed (with npm instal packet)
* express
* express-handlebars
* http
* socket.io
* socket.io-client
* express-session
* passport
* passport-local
* pg
* nodemon
All packages, along with their versions, can be found in [package.json](/package.json) and [package-lock.json](/package-lock.json).

The client scripts used are 
* <script src="https://code.highcharts.com/highcharts.js"></script>
* <script src="https://code.highcharts.com/modules/data.js"></script>
* <script src="https://code.highcharts.com/modules/exporting.js"></script>
* <script src="https://cdn.socket.io/4.4.1/socket.io.min.js"></script>
* <script src="/leaflet.js"></script>
**Note 1** The socket.io and socket.io-client packages on the backend and the script on the client, <script src="https://cdn.socket.io/4.4.1/socket.io.min.js"></script>, must be the same version for the sockets connection to work, specifically version 4.4.1 is used.

**Note 2** In the connection to the heroku PostgresSQL database,the connection details are changed automatically ,so if there is an inability to connect to the database it is because the details need to be updated to work locally.


## Explanation of application code

The layout of the application follows the MVC logic i.e. the program is divided into several sections:
- [/model](/model) which provides access to the database data
- [/controller](/controller) contains functions to access the data provided by the model
- The views, routes and public folders:
- [/views](/views) contains templates written in handlebars
- The [/routes](/routes) contains the rest of the apis that the application recognizes.
- The [/public](/public) contains the css files for the handlebars and the appropriate javascript files


## The model - The model
The `/models` folder contains only one model 
- `postgres-model.js`, it is used for the application to access the postgres sql database and returns the results of queries.



## The controller
The file `/controller/weight-app-controller.js` contains the model handling functions.That is, for the actions of the server apis ,the controller checks for the information requested by the route,gets it from the models and checks for the server response.

## Routes
In the file `/routes/weight-app-routes.js` is responsible for the routes that the application recognizes ,it checks for user login,using the passport software for user authentication ,for new user insertion and for sockets for auto-refresh.
