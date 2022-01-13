'use strict';
const fs = require('fs');
const lockFile = require('lockfile')

//where tasks are stored
const tasksFile = './model/tasks.json'

const lock = './model/lock-file'


//Δημιουργός (constructor) ενός αντικειμένου τύπου Task
//Αν περαστεί ένα μόνο όρισμα, τότε τα άλλα δύο 
//status=0 σημαίνει η εργασία είναι ενεργή, 1 σημαίνει έχει ολοκληρωθεί 
//Constructor for a Task object. status 0 means that the task is active,
//status 1 means task is completed (striked-through)
exports.Task = function (taskName, status = 0, created_at = '') {
    this.task = taskName;
    this.status = status;  //0 -> active, 1 -> completed
    this.created_at = created_at; //date of creation
}

//Προβολή όλων των εργασιών - show all tasks
exports.getAllWeights=function(client,callback){
    /*var data={
        devices:[
        {"id":1,"weight":2.54,"lognitude":21.708996,"latitude":41.771312,"time":"12:23","date":"12/11/2021"},
        {"id":2,"weight":30.0,"lognitude":21.747221,"latitude":38.236225,"time":"15:23","date":"12/11/2021"}
        
    ]
    }
    var devices=JSON.parse(JSON.stringify(data))

    callback(null, devices)*/
    console.log('getting data')
    var quer=
    `select public.collection_data.coll_id as pos, weight,lang,long,date_time,device_name,public.has_weight.device_id1 from public.collection_data,public.has_weight,public.device 
    where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=public.device.device_id;`;
    client.connect();
    client.query(quer,(err,res)=>{
            if(!err){
            console.log(res.rows)
           
            var data={
                devices:res.rows
            }
            var devices=JSON.parse(JSON.stringify(data))

            callback(null, devices)

            }
            else{

            console.log(err.message);
            callback(err, null)

            }

            })


}
exports.getID=function(ID,client,callback){
    var d1=ID
    
    console.log(`d1 is ${d1}`)
    /*var data={
        device:d1,
        id:[
        {"weight":2.54,"lognitude":21.708996,"latitude":41.771312,"time":"12:23","date":"12/11/2021"},
        {"weight":32.0,"lognitude":21.747221,"latitude":38.236225,"time":"15:23","date":"12/11/2021"}
        
    ]
    }
    var device=JSON.parse(JSON.stringify(data))*/
    client.connect();
    client.query(`select * from public.collection_data,public.has_weight 
    where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1};`,(err,res)=>{
    if(!err){
      console.log(res.rows)
      console.log(res.rows[0].date_time.toLocaleDateString())
      var data={
        device:d1,
        id:res.rows
    }
    var device=JSON.parse(JSON.stringify(data))
   
    callback(null, device)
    
    }
    else{
     
      console.log(err.message);
      callback(err, null)
      
    }
    
    })
    


    
}

exports.add_weight=function(data,client,callback){
    client.connect()
    const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`
    console.log(data)
    console.log(data.weight)
    callback(null,'success')
    
}

/*
exports.getAllTasks = function (callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(tasksFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                callback(null, JSON.parse(data))
            })
        }
    })
}

//Προσθήκη εργασίας - Add a new task
exports.addTask = function (newTask, result) {
    //Συμπληρώστε - Code here 
}

//Αφαίρεση μιας εργασίας - remove a task
exports.remove = function (newTask, result) {
    //Συμπληρώστε - Code here 
}

//Αλλαγή της κατάστασης μιας εργασίας - toggle task status
exports.toggleTask = function (taskId, result) {
    //Συμπληρώστε - Code here 
}*/