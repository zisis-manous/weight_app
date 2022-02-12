const express = require('express')
//const app = express()
//socket io



//end of socket io
const exphbs = require('express-handlebars');
const mqtt = require('mqtt')

const host = 'broker.emqx.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`



  
//Διαδρομές - Routse
const ROUTES = require('./routes/weight-app-routes');
const app=ROUTES.app
const io=ROUTES.io
const http=ROUTES.http
app.use('/', ROUTES.routes);

app.use(express.static(__dirname + '/public'));

//Χρήση των views - Using 'views'
//Σημ.: η engine πρέπει να έχει ίδιο όνομα με το extname, αλλιώς δεν θα αναγνωριστεί το extname (αλλιώς τα αρχεία θα πρέπει να τελειώνουν με .handlebars)
//Note: engine name must be the same as extname (hbs) otherwise the handlebars template engine will look for files ending in '.handlebars'
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');
/*
io.on('connection', function(socket){
    console.log('A user connected');
    
    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
       console.log('A user disconnected');
    });
 });*/
 

exports.app = app;
exports.io=io;
exports.http=http