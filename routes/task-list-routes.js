'use strict';

const express = require('express');
const { request } = require('../app');
const router = express.Router();

const taskListController = require('../controller/task-list-controller');
router.use(express.json());
//when the client requests a URI, the corresponding controller function will be called
router.get('/weights', taskListController.getAllWeights);
router.get('/', taskListController.getAllWeights);
//add routes for 
//removing a task: /tasks/remove/:removeTaskId
//adding a new task
//toggling a task
//router.get(`/weights/${id}`,taskListController.getID(id));
router.get('/device/:path', taskListController.getID);


router.post('weight',(request,response,next)=>{
    var h=request.body;
    console.log(h.id);
    response.redirect(`/weights/${h.id}`)

})

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