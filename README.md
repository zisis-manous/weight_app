
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

## Εφαρμογή για Low energy weighting systems
Η [εφαρμογή](https://weight-app-g2.herokuapp.com/) χρησιμοποιείται για έλεγχο και διαχείριση των συσκευών.

## Οδηγίες για εκτέλεση της εφαρμογής σε τοπικό επίπεδο
Η εφαρμογή που λειτουργεί με την συσκευή υπάρχει στο σύνδεσμο `https://weight-app-g2.herokuapp.com/`.
Η εφαρμογή χρησιμοποιεί για το `backend` την node.js και για το `frontend` γίνεται χρήση handlebars,css,javascript.
Οπότε θα πρέπει να υπάρχουν εγκατεστημένα
* [Node.js](https://nodejs.org/en/download/)
* Εγκατάσταση ενός packet management ,προτείνεται το [NPM](https://www.npmjs.com/)
* Το προγραμματιστικό περιβάλλον να είναι συμβατό με τις προγραμματιστικές γλώσσες
  - Handlebars
  - Css
  - Javascript

Τα πακέτα που πρέπει να εγκαταστηθούν (με npm instal packet)
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
Όλα τα πακέτα,μαζί με τις εκδοχές τους,βρίσκοντα στο φάκελο [package.json](/package.json) και [package-lock.json](/package-lock.json).

Tα scripts στον client που χρησιμοποιούνται είναι 
* <script src="https://code.highcharts.com/highcharts.js "></script>
* <script src="https://code.highcharts.com/modules/data.js "></script>
* <script src="https://code.highcharts.com/modules/exporting.js "></script>
* <script src="https://cdn.socket.io/4.4.1/socket.io.min.js "></script>
* <script src="/leaflet.js"></script>
**Σημείωση 1** Τα πακέτα socket.io και socket.io-client στο backend και το script στον client,<script src="https://cdn.socket.io/4.4.1/socket.io.min.js"></script>, πρέπει να είναι ίδια εκδοχή για να λειτουργεί η σύνδεση με sockets,συγκεκριμένα χρησιμοποιείται η εκδοχή 4.4.1.

**Σημείωση 2** Στην σύνδεση στη βάση δεδομένων heroku PostgresSQL,τα στοιχεία σύνδεσης αλλάζουν αυτόματα ,οπότε αν υπάρχει αδυναμία σύνδεσης με βάσης είναι γιατί πρέπει να ανανεωθούν τα στοιχεία για να δουλέψει σε τοπικό επίπεδο.


  



## Εξήγηση κώδικα εφαρμογής

Η διάταξη της εφαρμογής ακολουθεί την λογική MVC δηλαδή το πρόγραμμα μοιράζεται σε διάφορα τμήματα:
 - 	[/model](/model) που παρέχει πρόσβαση στα δεδομένα της βάσης
 -	[/controller](/controller) περιέχει συναρτήσεις για να έχουμε πρόσβαση στα δεδομένα που μας δίνει το model
 - Οι φάκελοι views, routes και public:
    - Ο [/views](/views) περιέχει template γραμμένα σε handlebars
    -	O [/routes](/routes) περιέχει τα rest apis που αναγνωρίζει η εφαρμογή
    -	Ο [/public](/public) περιέχει το css αρχεία για τα handlebars και τα κατάλληλα αρχεία javascript


## Το μοντέλο - The model
Ο φάκελος `/models` περιέχει μόνο ένα μοντέλο 
- `postgres-model.js`, χρησιμοποιείται για να έχει πρόσβαση η εφαρμογή στην βάση δεδομένων postgres sql και επιστρέφει τα αποτελέσματα των queries.



## Ο controller
Στο αρχείο `/controller/weight-app-controller.js` περιέχονται οι συναρτήσεις χειρισμού του μοντέλου.Δηλαδή για τις ενέργειες των apis του server ,ο controller ελέγχει για τις πληροφορίες που ζητάει το route,τις παίρνει απο το models και ελέχθει για το response του server.

## Routes
Στο αρχείο `/routes/weight-app-routes.js` είναι υπέυθυνο για τις διαδρομές που αναγνωρίζει η εφαρμογή ,κάνει έλεγχο για την σύνδεση του χρήστη,χρησιμοποιώντας το λογισμικό passport για την αυθεντικοποίηση του χρήστη ,για εισαγωγή νέου χρήστη και για τα sockets για την αυτόματη ανανέωση. 
