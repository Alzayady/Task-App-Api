const express=require('express');
const app=express();
require('../mongoose');
const UserRouter=require('../router/user')
const TaskRouter=require('../router/task')
const task =require('../src/module/task')
const user =require('../src/module/user')
const PORT=process.env.PORT;
app.use(express.json());
app.use(UserRouter)
app.use(TaskRouter)

app.listen(PORT,()=>{
    console.log("conected to server  "+PORT);
})
