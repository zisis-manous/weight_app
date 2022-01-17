'use strict';

const express = require('express');
const res = require('express/lib/response');
//const Pool = require('mysql/lib/Pool');
var mysql = require('mysql');
const { request } = require('../app');
const router = express.Router();
router.use(
  express.urlencoded({
    extended: true
  })
)
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

//δουλευει με arduinoo
router.post('/handle',(req,res)=>{
  console.log(req.body)

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


//check if the device is on or off
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