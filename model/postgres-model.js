'use strict';
const e = require('express');

//---From here we access the database to get or give data -----//

//1 gets the device state from database and returns the rows 
exports.getDevicesData=function(pool,callback){
    console.log('getting data')
    var quer=
    ` select device_id,is_on,sample_rate,mode from public.device order by device_id ASC;`;
    
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer,(err,res)=>{
            if(!err){
            
           console.log(res.rows)
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

}
//2 gets the last collection for each device from the database and returns the rows
exports.getAllWeights=function(pool,callback){
   
    console.log('getting data')
    var quer=
    `with q as(
    select public.collection_data.coll_id as pos,is_on,sample_rate, mode,weight,lang,long,date_time,device_name,public.has_weight.device_id1 from public.collection_data,public.has_weight,public.device 
        where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=public.device.device_id
        
    )
    select public.collection_data.coll_id as pos,is_on,sample_rate,mode, weight,lang,long,date_time,device_name,public.has_weight.device_id1 from public.collection_data,public.has_weight,public.device 
        where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=public.device.device_id and coll_id in (select max(q.pos)
    from q
    group by q.device_id1);`;
    
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
//3 gets the collection data from device with limit and returns the rows
exports.getID=function(ID,limit,pool,callback){
    var d1=ID
    console.log(limit)
    console.log(`d1 is ${d1}`)
    
    var quer=`select * from public.collection_data,public.has_weight 
    where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1} ORDER BY date_time ASC LIMIT ${limit};`
    //* 

    var quer1=`with row_count as (
        select COUNT(*) as row1 from public.collection_data,public.has_weight 
            where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1}
    ),
    q1 as (
    select * from public.collection_data,public.has_weight,row_count
            where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1}
            order by date_time DESC
            limit ${limit})
            
    select * from q1 
    order by date_time ASC`
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
           
             var data={
                device:d1,
                id:res.rows,
                lim:limit
            }
            console.log(data.lim)
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
//4 adding new collection data to the device
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
    })()
    
    
}
//5 checks the setting for certain device
exports.seeConnectivity=function(id,pool,callback){
   
    /*const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`*/
    
    const quer1=` select device_name,device_id,is_on,sample_rate,mode from public.device where device_id=${id};`
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

//6 sets the device on or off in database
exports.ChangeDeviceState=function(id,pool,callback){
   
    /*const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`*/
    
    console.log('changing device state')
    const quer1=`Update public.device
    set is_on= Case When(is_on=0) then 1
                ELSE 0 END
    where device_id=${id};`
    //console.log(data)
   
    /*
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
//7 changes the settings of the device in the database
exports.ChangeDeviceSettings=(id,sample_rate,change_state,mode,pool,callback)=>{

    console.log('changing Sample Rate')
    
    //change sample rate and device state
    var quer1
    /*
    if(change_state==1){
         quer1=`Update public.device
        set is_on= Case When(is_on=0) then 1
                    ELSE 0 END ,sample_rate=${sample_rate},mode=${mode}
        where device_id=${id}`
    }*/

    if(change_state!='hello'){

         quer1=`Update public.device
    set is_on=${change_state},sample_rate=${sample_rate},mode='${(mode)}'
    where device_id=${id};`
    }
    else{
        quer1=`Update public.device
        set sample_rate=${sample_rate},mode='${(mode)}'
        where device_id=${id};`
    }
    console.log(quer1)
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
//8 gets the sum of collection data that the database has
exports.Refresh_Homepage=function(pool,callback){
   
    /*const quer1=`INSERT INTO public.collection_data(
        weight, lang, "long", date-time)
        VALUES (${data.weight}, ${data.lang}, ${data.long}, ${data.date_time}');`*/
    
    const quer1=` select 
    MAX(coll_id) from public.collection_data ;`
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
//9 checks if a email already exists in the database
exports.EmailExists=(pool,email,callback)=>{
    
    const quer1=`SELECT username
    FROM users
   WHERE email = '${email}' `

    
    //console.log(data)
    
    ///*
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
                
                callback(null,res.rows)
    
                }
                else{
    
                //console.log(err.message);
                callback(err, null)
                
            }
            console.log('hello')
            })
        client.release()
        return
    })()

}

//10 adding new user in the database
exports.AddUser=(pool,req,callback)=>{
    
    

    const quer1=`INSERT INTO public.users (email,username, password) VALUES (
        '${req.body.email}','${req.body.username}',
        crypt('${req.body.psw}', gen_salt('bf'))
      );`

    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
                callback(null, 'success')
    
                }
                else{
    
                //console.log(err.message);
                callback(err, null)
                
            }
            console.log('hello')
            })
        client.release()
        return
    })()



}
//11 checks if the login data are correct in the database
//to sign in a user
exports.signUser=(pool,user,password,callback)=>{

    console.log('getting data')
    
    var quer=
    ` SELECT username,userid,admin
    FROM public.users
   WHERE email = '${user}'
    AND password = crypt('${password}', password);`;

    
    
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer,(err,res)=>{
            if(!err){
            
           console.log(res.rows)
           console.log('getting data from postgress')
            
            callback(null, res.rows)
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

}
//12 gets from the database the devices names
exports.NameDevices=(pool,callback)=>{
    var quer=
    ` select device_name,device_id from public.device;`;

    
    
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer,(err,res)=>{
            if(!err){
            
           console.log(res.rows)
           console.log('getting data from postgress')
            
            callback(null, res.rows)
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

}
//13 checks if a user is admin 
exports.check_admin=(pool,id,callback)=>{
    var quer=
    ` select admin from public.users where userid=${id};`
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer,(err,res)=>{
            if(!err){
            
           console.log(res.rows)
           console.log('getting data from postgress')
            
            callback(null, res.rows)
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

}
//14 gets from the database all the collection data for a device
exports.JsonDeviceData=(ID,pool,callback)=>{
    var d1=ID
    

    var quer1=`with row_count as (
        select COUNT(*) as row1 from public.collection_data,public.has_weight 
            where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1}
    ),
    q1 as (
    select * from public.collection_data,public.has_weight,row_count
            where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1}
            order by date_time DESC
            )
            
    select * from q1 
    order by date_time DESC`
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
           
             var data={
                device:d1,
                weight:res.rows,
                
            }
           
            var device=JSON.parse(JSON.stringify(data))
          
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
    })()

}
//gets from the database  the collection data with limit for a device
exports.JsonDeviceDataLimit=(ID,limit,pool,callback)=>{
    var d1=ID
    
    var quer1=`with row_count as (
        select COUNT(*) as row1 from public.collection_data,public.has_weight 
            where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1}
    ),
    q1 as (
    select * from public.collection_data,public.has_weight,row_count
            where public.collection_data.coll_id=public.has_weight.coll_id1 and public.has_weight.device_id1=${d1}
            order by date_time DESC
            limit ${limit}
            )
            
    select * from q1 
    order by date_time DESC`
    ;(async function() {
        const client = await pool.connect()
        await client.query(quer1,(err,res)=>{
            if(!err){
            
           
             var data={
                device:d1,
                weight:res.rows,
                
            }
            console.log(data.lim)
            var device=JSON.parse(JSON.stringify(data))
            //console.log(devices)
            callback(null, device)
            client.end()
            
            }
            else{

            console.log(err.message);
            callback(err, null)
            

            }
            console.log('hello there')
            })
        client.release()
        return
    })()

}