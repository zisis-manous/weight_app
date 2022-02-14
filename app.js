const express = require('express')
//const app = express()
//socket io



//end of socket io
const exphbs = require('express-handlebars');

  
//Διαδρομές - Routse
const ROUTES = require('./routes/weight-app-routes');
const app=ROUTES.app
const io=ROUTES.io
const http=ROUTES.http
app.use('/', ROUTES.routes);

app.use(express.static(__dirname + '/public'));

//Using 'views'
//Note: engine name must be the same as extname (hbs) otherwise the handlebars template engine will look for files ending in '.handlebars'
app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');


exports.app = app;
exports.io=io;
exports.http=http