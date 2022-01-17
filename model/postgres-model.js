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
exports.getAllWeights=function(pool,callback){
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
    `select public.collection_data.coll_id as pos,is_on weight,lang,long,date_time,device_name,public.has_weight.device_id1 from public.collection_data,public.has_weight,public.device 
    where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=public.device.device_id;`;
    
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer,(err,res)=>{
            if(!err){
            
           
            var data={
                devices:res.rows
            }
            var devices=JSON.parse(JSON.stringify(data))

            callback(null, devices)
            client.end()
            
            }
            else{

            console.log(err.message);
            callback(err, null)
            

            }
            console.log('hello')
            })
        client.release()
        return
    })()
    
    /*client.connect();

    client.query(quer,(err,res)=>{
            if(!err){
            
           
            var data={
                devices:res.rows
            }
            var devices=JSON.parse(JSON.stringify(data))

            callback(null, devices)
            client.end()
            return
            }
            else{

            console.log(err.message);
            callback(err, null)
            return

            }
            console.log('hello')
            })*/


}
exports.getID=function(ID,pool,callback){
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
    var quer=`select * from public.collection_data,public.has_weight 
    where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1};`
    //* 
    ;(async function() {
        const client = await pool.connect()
        await client.query(`select * from public.collection_data,public.has_weight 
        where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1};`,(err,res)=>{
            if(!err){
            
           
             var data={
                device:d1,
                id:res.rows
            }
            var device=JSON.parse(JSON.stringify(data))
            //console.log(devices)
            callback(null, device)
            client.end()
            
            }
            else{

            console.log(err.message);
            callback(err, null)
            

            }
            console.log('hello')
            })
        client.release()
        return
    })()//*/
    /*
    pool.connect();
    pool.query(`select * from public.collection_data,public.has_weight 
    where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1};`,(err,res)=>{
    if(!err){
      
      
      var data={
        device:d1,
        id:res.rows
    }
    var device=JSON.parse(JSON.stringify(data))
   
    callback(null, device)
    return
    
    }
    else{
     
      console.log(err.message);
      callback(err, null)
      return
      
    }
    
    })
    //*/


    
}

exports.add_weight=function(data,pool,callback){
   
    /*const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`*/
    
    const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date_time)
        VALUES (${data.weight},${data.lang},${data.long},'${data.date_time}' );
        insert into public.has_weight(device_id1,coll_id1) 
        select device_id,max(coll_id) from public.collection_data, public.device
        where device_id=${data.device_id}
        group by device_id;`
    //console.log(data)
    console.log(data.weight)
    //*
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
                callback(null, 'success')
    
                }
                else{
    
                console.log(err.message);
                callback(err, null)
                
            }
            console.log('hello')
            })
        client.release()
        return
    })()//*/
    /*client.connect();
    client.query(quer1,(err,res)=>{
            if(!err){
            
           
            

            callback(null, 'success')

            }
            else{

            console.log(err.message);
            callback(err, null)
            return

            }

    })*/
    //callback(null,'success')
    
}

exports.seeConnectivity=function(id,pool,callback){
   
    /*const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`*/
    
    const quer1=`select is_on 
    from public.device
    where device_id=${id};`
    //console.log(data)
    
    //*
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
           
             var data={
                device:res.rows
            }
            var device=JSON.parse(JSON.stringify(data))
            //console.log(devices)
            callback(null, device)
            client.end()
            
            }
            else{

            console.log(err.message);
            callback(err, null)
            

            }
            console.log('hello')
            })
        client.release()
        return
    })()//*/
    
    
    
}


exports.ChangeDeviceState=function(id,pool,callback){
   
    /*const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`*/
    
    
    const quer1=`Update public.device
    set is_on= Case When(is_on=0) then 1
                ELSE 0 END
    where device_id=${id};`
    //console.log(data)
   
    //*
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
                callback(null, 'changed_state')
    
                }
                else{
    
                console.log(err.message);
                callback(err, null)
                
            }
            console.log('hello')
            })
        client.release()
        return
    })()//*/
    
    
}