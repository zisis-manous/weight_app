'use strict';
const res = require('express/lib/response');
const { response } = require('../app.js');
/** You can define other models as well, e.g. postgres */
const model = require('../model/task-list-model-no-db.js');

exports.getAllTasks = (req, res) => {
    console.log("getAllTasks")
    model.getAllTasks((err, tasks) => {
        if (err) {
            res.send(err);
        }
        res.render('tasks', tasks);
    });
}

exports.getAllWeights=(request,response)=>{
    console.log('get all weights')
    
   // response.render('tasks',devices)
    //*
    model.getAllWeights((err,devices)=>{
        if (err) {
            response.send(err);
        }

        response.render('tasks', devices);
    })//*/
}
exports.getID=(request,response)=>{
    console.log(request.params.path)
    model.getID(request.params.path,(err,device)=>{
        if (err) {
            response.send(err);
        }

        response.render('devices',device)
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