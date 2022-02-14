'use strict';

/** You can define other models as well, e.g. postgres */
const model = require('../model/postgres-model.js');



const store = require("store2");

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

//1 getting the last collection data for each device and creates the homepage 
exports.getAllWeights=(request,response)=>{
    console.log('get all weights')
    //console.log(request.user)
    var user=request.user
    store.setAll({name: 'Adam', age: 34})
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    const pool2 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.getAllWeights(pool1,(err,devices)=>{
       
        if (err) {
            response.send(err);
        }
        
        
        var a
        //checking if user is signed in/admin or not to create the json
        if(user!=undefined){
           
            if(user.admin==1){
                a={
                    'username':user.name,
                    'id1':user.id,
                    'admin':1,
                    devices
                }

            }
            else{
                a={
                    'username':user.name,
                    'id1':user.id,
                    devices
                }

            }
    
    }
        else{
            a={
                devices
            }
        }
        
        var data=JSON.parse(JSON.stringify(a))
        //renders the hbs file home_page and gives it the data for the page
        response.render('home_page', data);
    })
}
//2 for certain device ,gets the 10 last data and creates the device page 
exports.getID=(request,response)=>{
   
      const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
    });
     var limit
     limit=10
     
     var user=request.user
     
    //gets from the database the data
    model.getID(request.params.device_id,limit,pool,(err,device)=>{
        if (err) {
            response.send(err);
        }
        //pool.end();
        
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
        if(user.admin==1){
            device['admin']=1
        }
    }
        else{
            a={
                device
            }
        }
        var data=JSON.parse(JSON.stringify(a))
        //renders the hbs file devices with data device
        response.render('devices',device)
    })
   

}
//3 handles when a new collection data have been sent for the device
exports.AddWeight=(io,request,response)=>{
    //checks if the password is correct
    if(request.body.password=="arduino"){
        //sends from sockets for updating the pages, homepage and device history 
        io.emit('change_weight', request.body);
        var string1='new_weight'+request.body.device_id
        
        io.emit(string1,request.body)
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
    //updating the database
    model.add_weight(request.body,pool1,(err,okay)=>{
        
        if(err){
            response.send(err);
        }
        //if everything is alright it responds
        response.send(okay)


    })
    }
    else{
        //if the wrong password is given it sends the proper respond
        response.send('wrong password')
    }
}

//4 checks the device state
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

//5 closes or opens the device
exports.ChangeDeviceState=(request,response)=>{
    var id=request.params.id;
    //checks if the password is correct
    if(request.body.password=="arduino"){
        const pool1 = new Pool({
            connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
            ssl: {
                rejectUnauthorized: false,
            },
            });
        //updates the database with the new state
        model.ChangeDeviceState(id,pool1,(err,okay)=>{
            //pool1.end()
            if(err){
                response.send(err);
            }
            //gives the proper respond
            response.send(okay)
    
    
        })
        }
        else{
            //if the password is wrong ,gives the proper respond
            response.send('wrong password')
        }

}
//6 gets the state of all the devices 
exports.getDevicesData=(request,response)=>{
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    //gets from the database the devices data
    model.getDevicesData(pool1,(err,devices)=>{
       
        if (err) {
            response.send(err);
        }
   
        //changing the device mode from string to integers
        for(var i=0;i<devices.devices.length;i++){
            if(devices.devices[i].mode=='psm'){
                devices.devices[i].mode=1
            }
            else if(devices.devices[i].mode=='reqular'){
                devices.devices[i].mode=0

            }
            else if(devices.devices[i].mode=='press_mode'){
                devices.devices[i].mode=2

            }
        }
      
        //responds with a json
        response.send(devices);
    })
}

//7 changes the device settings from the homepage 
exports.Change_Device_Setting =(io,req,res)=>{
    var sample_rate2
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    var change_state
    //console.log(req.body)
    if(req.body.mode=="press_mode"){
        req.body.sample_rate=0
    }
    if(req.body.change_state!=undefined){
        change_state=req.body.change_state
    }
    else{
        change_state='hello'
    }
    
    io.emit('change_state', req.body);
        var string1='new_state'+req.body.device_id
        console.log('STRING1-->'+string1)
        io.emit(string1,req.body)
    model.ChangeDeviceSettings(req.body.device_id,req.body.sample_rate,change_state,req.body.mode,pool1,(err,message)=>{
        if (err) {
            res.send(err);
        }
        
        //pool1.end();
        //pool1.
        res.redirect('/')

    })
    
    
    
  }

  //8 changes the device settings from the device page
exports.Change_Device_Setting2 =(io,req,res)=>{
    var sample_rate2
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    var change_state
    console.log(req.body)
    if(req.body.mode=="press_mode"){
        req.body.sample_rate=0
    }
    if(req.body.change_state!=undefined){
        change_state=req.body.change_state
    }
    else{
        change_state='hello'
    }
    
    io.emit('change_state', req.body);
        var string1='new_state'+req.body.device_id
        
        io.emit(string1,req.body)
    model.ChangeDeviceSettings(req.body.device_id,req.body.sample_rate,change_state,req.body.mode,pool1,(err,message)=>{
        if (err) {
            res.send(err);
        }
        
       
        //redirects to the device page
        res.redirect(`/device/${req.body.device_id}`)

    })
    
    
    
  }

  //9 gets the device data for certain limit 
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
       
        //gets from database the data with limit
        model.getID(request.params.id,limit,pool,(err,device)=>{
            if (err) {
                response.send(err);
            }
            //pool.end();
            //console.log(device)
            var a
            //checks if the user is signed in
            if(user!=undefined){
             a={
                'username':user.name,
                'id1':user.id,
                device
            }
            device['username']=user.name
            device['id1']=user.id
            if(user.admin==1){
                device['admin']=1
            }
        }
            console.log(device.username)
           console.log(device.lim)
           //renders the hbs file devices with the limit
            response.render('devices',device)
        })
       
       
}

//10 checks the sum of the collection data
//to see if there is new data to refresh the homepage
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
//11 adding new user 
exports.registerUser=(request,response)=>{
    
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
        //checks if the email exists
        model.EmailExists(pool1,request.body.email,(err,return_message)=>{
            console.log(return_message)
            if (err) {
                response.send(err)
            }
            else if(return_message.length==0){
                 //if it doesn't exists creates the new user
                model.AddUser(pool1,request,(err,return_message)=>{
        
                    if (err) {
                        response.send(err)
                    }
                    //if it exists redirects to /login
                   response.redirect('/login')
                 
                    
                })


            }
            else{
               //if exists ,redirects to register page
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

}
//12 handles when a user login
exports.signUser=(user,password,callback)=>{
    
  
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    //checks the login data with the users data
    model.signUser(pool1,user,password,(err,user_det)=>{
        console.log('have accessed postgress')
        //console.log(user_det)
        if (err) {
            console.log(err)
            return callback(null,null)
        }
        //for wrong login doesn't login and redirects to /login
        else if(user_det.length==0){
            return callback(null,null)
            
        }
        else{
            //successfull login ,parsing the user in cookies 
            console.log('returning authenticated user')
            
            let authenticated_user = user_det
            
            
            return callback(null,authenticated_user[0])
            

        }

    })
    
    
    


}
//13 json to return the devices names
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
//14 checks if a user is admin
exports.CheckAdmin=(request,response)=>{
    console.log(request.body)
    const pool1 = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
    });
    model.check_admin(pool1,2,(err,is_admin)=>{
        if(err){
            response.send(err)

        }
        console.log(is_admin[0].admin)
        response.send(is_admin)

    })
    
}
//15 gets from database all the data and return json
exports.JsonDeviceWeight=(request,response)=>{
    const pool = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
         var limit
         limit=10
        
         //var user=request.user
         
        console.log(request.params.device_id)
        model.JsonDeviceData(request.params.device_id,pool,(err,device)=>{
            if (err) {
                response.send(err);
            }
            
           
            
            response.send(device)
        })
       
    

}
//16 gets from database the device data with limit and returns json
exports.JsonDeviceWeightLimit=(request,response)=>{
    const pool = new Pool({
        connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        });
         var limit
         limit=10
        
         //var user=request.user
         
        console.log(request.params.device_id)
        model.JsonDeviceDataLimit(request.params.device_id,request.params.limit,pool,(err,device)=>{
            if (err) {
                response.send(err);
            }
           
           
            
            response.send(device)
        })

    
}
