# WEIGHT APP FOR LPWAN WEIGHTING SYSTEMS

Απλή εφαρμογή υλοποίησης της εφαρμογής ΙoT για Low energy weighting systems
της Ομάδας 2



## Λεπτομέρειες - Details

Το `app.js` ακολουθεί τη λογική MVC. Το πρόγραμμα μοιράζεται σε διάφορα τμήματα: 
 - `/model` παρέχει την πρόσβαση στα δεδομένα.
 - `/controller` περιέχει συναρτήσεις για να έχουμε πρόσβαση στα δεδομένα που μας δίνει το model.
 - Οι φάκελοι `views` και `routes`:
  - Ο `/views` περιέχει template γραμμένα σε handlebars.
  - Ο `/routes` περιέχει τις διαδρομές που αναγνωρίζει η εφαρμογή.



## Το μοντέλο - The model
Ο φάκελος `/models` περιέχει μόνο ένα μοντέλο 
- `task-list-model-no-db.js`, παιρνει τα δεδομένα που ζητάει ο χρήστης απο την βάση και επιστρέφει 
το βάρος και την τοποθεσία της συσκευής.



## Ο controller
Στο αρχείο `/controller/task-list-controller.js` περιέχονται οι συναρτήσεις χειρισμού του μοντέλου.



```javascript
const model = require('../model/task-list-model-no-db.js');
// const model = require('../model/task-list-model-mongo.js');
// const model = require('../model/task-list-model-postgres.js');
```


