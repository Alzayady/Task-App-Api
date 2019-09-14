const Router=require('express').Router();
const {ObjectId}=require('mongodb')
const task=require('.././src/module/task')
const user=require('.././src/module/user')
const auth=require('../src/middleware/auth')
Router.get("/task",auth,async(req,res)=>{
  const match={}
  const sort={}
  if(req.query.sortBy){
    const parts=req.query.sortBy.split(':');
    sort[parts[0]]= parts[1]==='desc'?-1:1
  }
  if(req.query.complete){
    match.complete=req.query.complete==='true'
  }
    try{
     const tasks=await req.User.populate({
       path:'MyTask',
       match,
       options:{
          limit:parseInt(req.query.limit),
          skip:parseInt(req.query.skip),
          sort
       }
     }).execPopulate()
      return res.send(req.User.MyTask);
    }catch(e){
      res.status(500).send(e.message)
    }
  })
  
  Router.get("/task/:id",auth,async (req,res)=>{
    try{
      const tasks=await task.findById(req.params.id)
      if(tasks.owner.toString()!==req.User._id.toString()){
        throw new Error ("you don't it's owner")
      }
      if(!tasks)return res.status(404).send();
      res.send(tasks)
    }catch(e){
      res.status(400).send(e.message)
    }
    
  })
  
  
  Router.post("/task",auth,async(req,res)=>{
      const newtask=req.body;
      req.body.owner=req.User._id;
      const newtaskcreated= new task(newtask);
  
      try{
           await newtaskcreated .save()
          res.send(newtaskcreated)
      }catch(e){
         res.status(400).send(e.message)
      }
  
  })
  
  
  Router.patch('/task/:id',auth,async (req,res)=>{
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
        if(Task.owner.toString()!==req.User._id.toString()){
          throw new Error ("you don't it's owner")
        }
       //  const Task=await task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
         if(!Task){return res.status(404).send()}
         examine.forEach((e)=>  Task[e]=req.body[e])
        await Task.save();
         res.send(Task)
  
        }catch(e){
          console.log(e)
       res.status(500).send(e.message)
        }
  })
  
  Router.delete('/task/:id',auth,async(req,res)=>{
  
     try{
       new ObjectId(req.params.id)
     }catch(e){
       return res.status(400).send()
     }
  
     try{

      const Task =await task.findOneAndDelete({_id:req.params.id,owner:req.User._id})

      if(!Task)return res.status(404).send()
      res.send(Task)
     }catch(e){
    
      res.status(500).send(e.message)
  
     }
  
  })

  module.exports=Router