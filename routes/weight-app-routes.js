'use strict';

const express = require('express');

const app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

const res = require('express/lib/response');
//const Pool = require('mysql/lib/Pool');
var mysql = require('mysql');
const session = require('express-session')
const { request } = require('../app');
const router = express.Router();


router.use(
  express.urlencoded({
    extended: true
  })
)


const passport=require('passport')
const Chart = require('chart.js');

//passport middleware for user sign in

const LocalStrategy = require('passport-local').Strategy
let authUser = (user, password, done) => {
  //Search the user, password in the DB to authenticate the user
  //Let's assume that a search within your DB returned the username and password match for "Kyle".
  //login
  console.log('authUser')
  deviceController.signUser(user,password,(err,auth)=>{
    console.log('after signUser the auth')
    console.log(auth)
    done(null,auth)
  })
  /*
  if(user=='zisismanous@gmail.com' || user=='test@gmail.com'){
     let authenticated_user = { id: 123, name: user}
     return done (null, authenticated_user )
    }
    else{
      //can't login
      done (null, null )
    }*/
     
}



passport.use(new LocalStrategy(authUser))


passport.serializeUser( (user, done) => { 
  console.log(`--------> Serialize User`)
  console.log(user)     

  done(null, user)


} )


passport.deserializeUser((user, done) => {
      //console.log("---------> Deserialize Id")
      

      done (null, {name: user.username, id: user.userid,admin:user.admin} )      

}) 
//-------------

// insert cookies
router.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
router.use(passport.initialize());
router.use(passport.session())
//---------

const bodyParser = require('body-parser');
router.use(express.json());
router.use(express.urlencoded())
router.use(bodyParser.json());

router.use(express.json())

//const deviceController = require('../controller/weight-app-controller');

const deviceController = require('../controller/weight-app-controller');
router.use(express.json());

//when the client requests a URI, the corresponding controller function will be called
const Pool = require("pg").Pool;
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});




let count = 1



//socket.io

//APPLICATION'S ROUTES 

//get requests------------------------------------

  //1 
  router.get('/device/:id/more',(req,res)=>{
    //console.log(req)
    res.send('okay')
  })

  //2 check device state(if its operational ,sample rate and mode)
router.get('/device/state/:id',deviceController.seeConnectivity)

  //3 getting all the weights for homepage
router.get('/weights', deviceController.getAllWeights);

  //4 getting all the weights for homepage
router.get('/', deviceController.getAllWeights);

  //5 creating the page of the device history
router.get('/device/:device_id', deviceController.getID);

  //6 get state and sample rate  and mode for all the devices
router.get('/devices_data',deviceController.getDevicesData)
  //7 Get device data for certain limit
router.get('/device/:id/limit/:lim',deviceController.DataPlot)

  //8
router.get('/refresh_homepage',deviceController.RefreshHomepage)

  //9 get login page
router.get('/login',(req,res)=>{
  res.render('login')
})

  //10 get register page
router.get('/register',(req,res)=>{
  var user=req.user
  var a
        if(user!=undefined){
         a={
            'username':user.name,
            'id1':user.id
            
        }
        if(user.admin==1){
          a['admin']=1
        }
      }
        
        else{
            a={
                
            }
        }

  res.render('register',a)
})

  //11 log out user
router.get('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})
  //12
router.get('/success',(req,res)=>{
  res.send('hello there')
})

//13 get request with json for device's name
router.get('/name_devices',deviceController.NameDevices)
//14 get request with json device history weight without limt
router.get('/device_weight/:device_id',deviceController.JsonDeviceWeight)
//15 return json with history weight for limit
router.get('/device_weight/:device_id/limit/:limit',deviceController.JsonDeviceWeightLimit)


/


//post requests--------------------------------
  // 1 δουλευει με arduinoo
router.post('/handle',(req,res)=>{
  console.log(req.body)
  //io.emit('message', req.body);

  res.send(req.body)
})

  //2
router.post('/data_plot',deviceController.DataPlot)

  //3 input new collection data
router.post('/add_weight',(request,response)=>{deviceController.AddWeight(io,request,response)})
//--------------------------

  //4 
router.post('/change_device_settings',(request,response)=>{deviceController.Change_Device_Setting(io,request,response)})

router.post('/change_device_settings2',(request,response)=>{deviceController.Change_Device_Setting2(io,request,response)})
  //5 close or open the device
router.post('/device/:id/change_state',deviceController.ChangeDeviceState)

  //6 post request to login user
router.post('/login_user',passport.authenticate('local', {
  
  successRedirect: "/",
  failureRedirect: "/login",
}))

  //7 post request for adding new user
router.post('/register_user',deviceController.registerUser)



//--------------------
//mqtt -----
const mqtt = require('mqtt')
const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const connectUrl = `mqtt://${host}:${port}`

function mqtt_connect(){
  const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASS,
    reconnectPeriod: 1000,
  })
  
  client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`)
    })
  })
  return client
}


//--------------------
router.get('/mqtt_test',(req,res)=>{
  const topic = 'add_weight/1'

//var client=mqtt_connect()
//console.log(client)
/*
client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
  
})*/
res.send('hello there')


})
//----------------

exports.routes = router;
exports.io=io;
exports.app=app
exports.http=http