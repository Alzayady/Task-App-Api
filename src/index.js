const express=require('express');
const app=express();
require('../mongoose');
const UserRouter=require('../router/user')
const TaskRouter=require('../router/task')
const PORT=process.env.PORT||3000;
app.use(express.json());
app.use(UserRouter)
app.use(TaskRouter)



app.listen(PORT,()=>{
    console.log("conected to server");
})

