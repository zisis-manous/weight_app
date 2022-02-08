'use strict';

const express = require('express');
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
      

      done (null, {name: user.username, id: user.userid} )      

}) 

router.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
router.use(passport.initialize());
router.use(passport.session())


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


/*new Client({
  host: "localhost",
  user:"postgres",
  port:5432,
  password:"3c3aedff0a",
  database: "scale_devices"

})*/

let count = 1
/*
let printData = (req, res, next) => {
    console.log("\n==============================")
    console.log(`------------>  ${count++}`)

    console.log(`req.body.username -------> ${req.body.username}`) 
    console.log(`req.body.password -------> ${req.body.password}`)

    console.log(`\n req.session.passport -------> `)
    console.log(req.session.passport)
  
    console.log(`\n req.user -------> `) 
    console.log(req.user) 
  
    console.log("\n Session and Cookie")
    console.log(`req.session.id -------> ${req.session.id}`) 
    console.log(`req.session.cookie -------> `) 
    console.log(req.session.cookie) 
  
    console.log("===========================================\n")
   
    console.log(req.user)
    next()
}

router.use(printData)*/

//δουλευει με arduinoo
router.post('/handle',(req,res)=>{
  console.log(req.body)

  res.redirect('/device/0')
})

router.post('/data_plot',deviceController.DataPlot)
router.get('/device/:id/more',(req,res)=>{
  console.log(req)
  res.send('okay')
})
//input new collection data
router.post('/add_weight',deviceController.AddWeight)
//--------------------------
/*
router.get('/db',(request,response)=>{
  //response.send('hello there')
  pool.connect();
  
  pool.query("select * from public.device",(err,res)=>{
    if(!err){
      console.log(res.rows)
      response.json(res.rows)
    }
    else{
      console.log(err.message);
      response.json(err.message)
    }
  })
})*/

router.post('/change_device_settings',deviceController.Change_Device_Setting)

//check device state(if its operational ,sample rate and mode)
router.get('/device/state/:id',deviceController.seeConnectivity)
//close or open the device
router.post('/device/:id/change_state',deviceController.ChangeDeviceState)
//getting all the weights for homepage
router.get('/weights', deviceController.getAllWeights);
//getting all the weights for homepage
router.get('/', deviceController.getAllWeights);
//add routes for 
//removing a task: /tasks/remove/:removeTaskId
//adding a new task
//toggling a task
//router.get(`/weights/${id}`,taskListController.getID(id));

//creating the page of the device history
router.get('/device/:device_id', deviceController.getID);

//get state and sample rate  and mode for all the devices
router.get('/devices_data',deviceController.getDevicesData)

router.get('/device/:id/limit/:lim',deviceController.DataPlot)

router.get('/refresh_homepage',deviceController.RefreshHomepage)

router.get('/login',(req,res)=>{
  res.render('login')
})
router.get('/register',(req,res)=>{
  res.render('register')
})

router.post('/login_user',passport.authenticate('local', {
  
  successRedirect: "/",
  failureRedirect: "/login",
}))


router.post('/register_user',deviceController.registerUser)

router.get('/logout',(req,res)=>{
  req.logOut()
  res.redirect('/login')
})
router.get('/success',(req,res)=>{
  res.send('hello there')
})
/*
router.get('device/api/scales/:path',(request,response)=>{
    

})
router.post('/weight',(request,response,next)=>{
    var h=request.body;
    console.log(h.id);
    response.redirect(`/weights/${h.id}`)

})
router.get('/kristi_test/:path',(req,res)=>{
  console.log(req.params.path)
  res.send('success you did a get request')
})
router.put('/add_weight1/:path',(req,res)=>{
  console.log(req.params.path)
  data=JSON.parse(req.params.path)
  console.log(data)
  res.send('ok')

})

router.post('/add_weight/:path', (req, res) => {
    console.log(req.params.path)
    console.log(req.params.path.hello)
    res.send('success boii ')
  })

router.get('/input_weight/:path',deviceController.giveInputWeight)
*/

/*
router.post('/delete_task',(request,response,next)=>{
    var h=request.body;
    console.log(h);
    response.redirect('/tasks');
})


router.post('/change_status',(request,response,next)=>{
    var h=request.body;
    console.log(h);
    response.redirect('/tasks');
})

router.post('/add_task',(request,response,next)=>{
    var h=request.body;
    console.log(h.id);
    response.redirect('/tasks');
})
//*/

module.exports = router;