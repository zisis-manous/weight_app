'use strict';
const res = require('express/lib/response');
const { response } = require('../app.js');
/** You can define other models as well, e.g. postgres */
const model = require('../model/postgres-model.js');

var mysql = require('mysql');


const Pool = require("pg").Pool;
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;




exports.getAllTasks = (req, res) => {
    console.log("getAllTasks")
    model.getAllTasks((err, tasks) => {
        if (err) {
            res.send(err);
        }
        res.render('home_page', tasks);
    });
}
exports.giveInputWeight=(req,res)=>{
    console.log("giving input weight")
    console.log(req.params.path)
    res.send(req.params.path)
}
exports.getAllWeights=(request,response)=>{
    console.log('get all weights')
    /*const client2=new Client({
        host: "localhost",
        user:"postgres",
        port:5432,
        password:"3c3aedff0a",
        database: "scale_devices"
      
      })*/

          /*
        host: "ec2-54-229-47-120.eu-west-1.compute.amazonaws.com",
        user:"jpbdcgwojbmmvg",
        port:5432,
        password:"375818917adcdfcf4cf011ec2608bfc0b927293963c6febe5e6eba5b40493513",
        database: "d21pclk7o4hrfl"
      
      })*/
      
   // response.render('tasks',devices)
    //*
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.getAllWeights(pool1,(err,devices)=>{
       
        if (err) {
            response.send(err);
        }
        console.log(devices);
        pool1.end();
        
        response.render('home_page', devices);
    })//*/
}
exports.getID=(request,response)=>{
    /*const client1=new Client({
        host: "ec2-54-229-47-120.eu-west-1.compute.amazonaws.com",
        user:"jpbdcgwojbmmvg",
        port:5432,
        password:"375818917adcdfcf4cf011ec2608bfc0b927293963c6febe5e6eba5b40493513",
        database: "d21pclk7o4hrfl"
      
      })*/
      const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    });
     
    console.log(request.params.device_id)
    model.getID(request.params.device_id,pool,(err,device)=>{
        if (err) {
            response.send(err);
        }
        pool.end();
        response.render('devices',device)
    })
   

}

exports.AddWeight=(request,response)=>{
    console.log(request.body)
    //if(request.body.password=="arduino"){
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
    console.log(request.body);
    model.add_weight(request.body,pool1,(err,okay)=>{
        pool1.end()
        if(err){
            response.send(err);
        }
        response.send(okay)


    })
   // }
    //else{
       // response.send('wrong password')
   // }
}
/*
exports.getID=(id,request,response)=>{
    console.log(`get all weights for ${id}`)
    model.getID(id,(err,devices)=>{
        if (err) {
            response.send(err);
        }
        console.log('want to render',devices)
        var data={
            id:[
            {"weight":2.54,"lognitude":21.708996,"latitude":41.771312,"time":"12:23","date":"12/11/2021"},
            {"weight":30.0,"lognitude":21.747221,"latitude":38.236225,"time":"15:23","date":"12/11/2021"}
            
        ]
        }
        var device=JSON.parse(JSON.stringify(data))
        response.render('devices',device);
    })
    
}
*/
//add more controller functions, to be called when a user requests a specific
//route. each function will call the 'model', perform whatever calculations are
//necessary, and send the response to the client