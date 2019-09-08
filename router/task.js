const Router=require('express').Router();
const {ObjectId}=require('mongodb')
const task=require('.././src/module/task')

Router.get("/task",async(req,res)=>{
    try{
      const tasks= await task.find({});
      return res.send(tasks);
  
    }catch(e){
      res.status(500).send(e)
  
    }
  })
  
  Router.get("/task/:id",async (req,res)=>{
    try{
      const tasks=await task.findById(req.params.id)
      if(!tasks)return res.status(404).send();
      res.send(tasks)
    }catch(e){
      res.status(400).send(e)
    }
    
  })
  
  
  Router.post("/task",async(req,res)=>{
      const newtask=req.body;
      const newtaskcreated= new task(newtask);
  
      try{
           await newtaskcreated.save()
          res.send(newtaskcreated)
      }catch(e){
         res.status(400).send(e.message)
      }
  
  })
  
  
  Router.patch('/task/:id',async (req,res)=>{
       try{
        new ObjectId(req.params.id);
       }catch(e){
         return res.status(400).send()
       }
        const canChange=["description","complete"];
        const examine=Object.keys(req.body)
        const isvalid =examine.every( up => canChange.includes(up) )
        if(!isvalid)return res.status(400).send()
        try{
        const Task=await task.findById(req.params.id);
         
       //  const Task=await task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
         if(!Task){return res.status(404).send()}
         examine.forEach((e)=>  Task[e]=req.body[e])
        await Task.save();
         res.send(Task)
  
        }catch(e){
          console.log(e)
       res.status(500).send(e)
        }
  })
  
  Router.delete('/task/:id',async(req,res)=>{
  
     try{
       new ObjectId(req.params.id)
     }catch(e){
       return res.status(400).send()
     }
  
     try{
      const Task =await task.findByIdAndDelete(req.params.id)
      console.log(Task)
      if(!Task)return res.status(404).send()
      res.send(Task)
     }catch(e){
    
      res.status(500).send()
  
     }
  
  })

  module.exports=Router