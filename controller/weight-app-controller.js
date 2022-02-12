'use strict';
const res = require('express/lib/response');
const { response } = require('../app.js');
/** You can define other models as well, e.g. postgres */
const model = require('../model/postgres-model.js');

var mysql = require('mysql');

const store = require("store2");

const Pool = require("pg").Pool;
const { reset } = require('nodemon');
const req = require('express/lib/request');
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
    //console.log(request.user)
    var user=request.user
    store.setAll({name: 'Adam', age: 34})
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
        
        //pool1.end();
        //pool1.
        //console.log(devices)
        var a
        if(user!=undefined){
         a={
            'username':user.name,
            'id1':user.id,
            devices
        }}
        else{
            a={
                devices
            }
        }
        console.log(a)
        var data=JSON.parse(JSON.stringify(a))
        response.render('home_page', data);
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
     var limit
     limit=10
     
     var user=request.user
     
    console.log(request.params.device_id)
    model.getID(request.params.device_id,limit,pool,(err,device)=>{
        if (err) {
            response.send(err);
        }
        //pool.end();
        //console.log(device)
        device['limit']=limit
        var a
        if(user!=undefined){
         a={
            'username':user.name,
            'id1':user.id,
            device
        }
        device['username']=user.name
        device['id1']=user.id
    }
        else{
            a={
                device
            }
        }
        var data=JSON.parse(JSON.stringify(a))
        console.log(data)
        response.render('devices',device)
    })
   

}

exports.AddWeight=(request,response)=>{
    if(request.body.password=="arduino"){
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
    //console.log(request.body);
    model.add_weight(request.body,pool1,(err,okay)=>{
        //pool1.end()
        if(err){
            response.send(err);
        }
        response.send(okay)


    })
    }
    else{
        response.send('wrong password')
    }
}

exports.seeConnectivity=(request,response)=>{
    var id=request.params.id;
    console.log(id)
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
    model.seeConnectivity(id,pool1,(err,activity)=>{
        if(err){
            response.send(err);
        }
        response.send(activity)


    })

}

exports.ChangeDeviceState=(request,response)=>{
    var id=request.params.id;
    if(request.body.password=="arduino"){
        const pool1 = new Pool({
            connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
            ssl: {
                rejectUnauthorized: false,
            },
            });
        //console.log(request.body);
        model.ChangeDeviceState(id,pool1,(err,okay)=>{
            //pool1.end()
            if(err){
                response.send(err);
            }
            response.send(okay)
    
    
        })
        }
        else{
            response.send('wrong password')
        }

}

exports.getDevicesData=(request,response)=>{
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.getDevicesData(pool1,(err,devices)=>{
       
        if (err) {
            response.send(err);
        }
        
        //pool1.end();
        //pool1.
        response.send(devices);
    })//*/
}

exports.Change_Device_Setting =(req,res)=>{
    var sample_rate2
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    var change_state
    if(req.body.mode=="press_mode"){
        req.body.sample_rate=0
    }
    if(req.body.change_state!=undefined){
        change_state=req.body.change_state
    }
    else{
        change_state='hello'
    }
    model.ChangeDeviceSettings(req.body.device_id,req.body.sample_rate,change_state,req.body.mode,pool1,(err,message)=>{
        if (err) {
            res.send(err);
        }
        
        //pool1.end();
        //pool1.
        res.redirect('/')

    })
    
    
    
  }

exports.DataPlot=(request,response)=>{
    const pool = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
         var limit
         limit=request.params.lim
         
         var user=request.user
       
        console.log(request.params.id)
        model.getID(request.params.id,limit,pool,(err,device)=>{
            if (err) {
                response.send(err);
            }
            //pool.end();
            //console.log(device)
            var a
            if(user!=undefined){
             a={
                'username':user.name,
                'id1':user.id,
                device
            }
            device['username']=user.name
            device['id1']=user.id
        }
            console.log(device.username)
           console.log(device.lim)
            response.render('devices',device)
        })
       
       
}


exports.RefreshHomepage=(request,response)=>{
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.Refresh_Homepage(pool1,(err,devices)=>{
       
        if (err) {
            response.send(err);
        }
        
        //pool1.end();
        //pool1.
        //console.log(devices)
        response.send( devices);
    })//*/
}

exports.loginUser=(request,response)=>{

    console.log(request)
    response.send('okay')
}
exports.registerUser=(request,response)=>{
    
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
        model.EmailExists(pool1,request.body.email,(err,return_message)=>{
            console.log(return_message)
            if (err) {
                response.send(err)
            }
            else if(return_message.length==0){
                model.AddUser(pool1,request,(err,return_message)=>{
        
                    if (err) {
                        response.send(err)
                    }
                    
                   response.redirect('/login')
                   // response.send(return_message)
                    //pool1.end();
                    //pool1.
                    //console.log(devices)
                    
                })


            }
            else{
                var a
                    if(user!=undefined){
                        a={
                        'username':user.name,
                        'id1':user.id,
                        email:1
                    }}
                    else{
                            a={
                                email:1
                                }
                        }
                
                response.render('register',a)
            }

        })
    
        /*
        model.AddUser(pool1,request,(err,return_message)=>{
        
            if (err) {
                response.render('register',{email:1})
            }
            
           response.redirect('/login')
           // response.send(return_message)
            //pool1.end();
            //pool1.
            //console.log(devices)
            
        })//*/
    
}

exports.signUser=(user,password,callback)=>{
    
    /*if(user=='zisismanous@gmail.com' || user=='test@gmail.com'){
        let authenticated_user = { id: 123, name: user}
        callback(null,authenticated_user)
        return
    }
    else{
        callback(null,null)
        return
    }*/
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.signUser(pool1,user,password,(err,user_det)=>{
        console.log('have accessed postgress')
        //console.log(user_det)
        if (err) {
            console.log(err)
            return callback(null,null)
        }
        else if(user_det.length==0){
            return callback(null,null)
            
        }
        else{
            console.log('returning authenticated user')
            let authenticated_user = user_det
            //console.log('auth user')
            //console.log(authenticated_user)
            //let authenticated_user = { id: 123, name: user}
            return callback(null,authenticated_user[0])
            

        }

    })
    
    
    


}

exports.NameDevices=(request,response)=>{
    console.log(request.body)
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.NameDevices(pool1,(err,devices_name)=>{
        if(err){
            response.send(err)

        }
        response.send(devices_name)

    })
    
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