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
exports.getAllWeights=function(callback){
    var data={
        devices:[
        {"id":1,"weight":2.54,"lognitude":21.708996,"latitude":41.771312,"time":"12:23","date":"12/11/2021"},
        {"id":2,"weight":30.0,"lognitude":21.747221,"latitude":38.236225,"time":"15:23","date":"12/11/2021"}
        
    ]
    }
    var devices=JSON.parse(JSON.stringify(data))

    callback(null, devices)
}
exports.getID=function(ID,callback){
    var d1=ID
    console.log(`d1 is ${d1}`)
    var data={
        id:[
        {"weight":2.54,"lognitude":21.708996,"latitude":41.771312,"time":"12:23","date":"12/11/2021"},
        {"weight":32.0,"lognitude":21.747221,"latitude":38.236225,"time":"15:23","date":"12/11/2021"}
        
    ]
    }
    var device=JSON.parse(JSON.stringify(data))
    callback(null, device)
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