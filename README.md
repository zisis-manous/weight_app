
# WEIGHT APP-GROUP 2

Απλή εφαρμογή υλοποίησης της εφαρμογής ΙoT για Low energy weighting systems
της Ομάδας 2.
Για την ανάπτυξη και διαχείριση της [εφαρμογής](https://weight-app-g2.herokuapp.com/) γίνεται απο την πλατφόρμα `heroku`.
Για να λειτουργήσει η εφαρμογή δεν χρειάζεται κάποια εγκατάσταση αφού μπορεί να βρεθεί στο `https://weight-app-g2.herokuapp.com/`.
Απο την ίδια πλατφόρμα χρησιμοποιείται και η βάση δεδομένων `Heroku postgresSQL`.

##Εφαρμογή για Low energy weighting systems
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

Το `app.js` ακολουθεί τη λογική MVC. Το πρόγραμμα μοιράζεται σε διάφορα τμήματα: 
 - `/model` παρέχει την πρόσβαση στα δεδομένα.
 - `/controller` περιέχει συναρτήσεις για να έχουμε πρόσβαση στα δεδομένα που μας δίνει το model.
 - Οι φάκελοι `views` και `routes`:
  - Ο `/views` περιέχει template γραμμένα σε handlebars.
  - Ο `/routes` περιέχει τις διαδρομές που αναγνωρίζει η εφαρμογή.

## Το μοντέλο - The model
Ο φάκελος `/models` περιέχει μόνο ένα μοντέλο 
- `postgres-model.js`, χρησιμοποιείται για να έχει πρόσβαση η εφαρμογή στην βάση δεδομένων postgres sql και επιστρέφει τα αποτελέσματα των queries.



## Ο controller
Στο αρχείο `/controller/weight-app-controller.js` περιέχονται οι συναρτήσεις χειρισμού του μοντέλου.Δηλαδή για τις ενέργειες των apis του server ,ο controller ελέγχει για τις πληροφορίες που ζητάει το route,τις παίρνει απο το models και ελέχθει για το response του server.

## Routes
Στο αρχείο `/routes/weight-app-routes.js` είναι υπέυθυνο για τις διαδρομές που αναγνωρίζει η εφαρμογή ,κάνει έλεγχο για την σύνδεση του χρήστη,χρησιμοποιώντας το λογισμικό passport για την αυθεντικοποίηση του χρήστη ,για εισαγωγή νέου χρήστη και για τα sockets για την αυτόματη ανανέωση. 
