
const user=require('../src/module/user')
const Router=require('express').Router()
const {ObjectId}=require('mongodb')
const auth=require('../src/middleware/auth')
Router.get("/users",auth,async (req,res)=>{
    try{
      const users=await user.find({});
      return res.send(users)
    }catch(e){
       res.status(500).send(e)
    }
    })
    
    Router.get("/users/:id",async(req,res)=>{
        try{
         const usero=await user.findById(req.params.id);
         if(!usero)return res.status(404).send();
         res.send(usero)
        }catch(e){
        res.status(400).send()
        }
      
    })

    
Router.post("/users",async(req,res)=>{
    const data=req.body;
    const User= new user(data);
    const token=await User.GetAuthentiocation();
    User.Tokens=User.Tokens.concat({token});
    try{
     await User.save();
     res.status(201).send(User);
    }catch(e){
      res.status(400).send(e.message); 
    }
         
  })

  Router.post('/users/login',async(req,res)=>{
  
    try{
       const User=await user.login(req.body);
       const token=await User.GetAuthentiocation();
       User.Tokens=User.Tokens.concat({token})
       await User.save();
       res.send(User);
    }catch(e){
      res.status(400).send(e.message);
    }
  })

  
Router.patch('/users/:id',async (req,res)=>{
    const id=req.params.id;
    try{ new ObjectId(id);}catch(e){return res.status(400).send() }
    const canChange=["name","password" ,"age" ,"Email"]
    const examine=Object.keys(req.body);
    const isValid= examine.every((update) => canChange.includes(update))
     if(!isValid){res.status(400).send("Invalid Input")}
  
    try{
        const User=await user.findById(req.params.id);
        if(!User){res.status(404).send()}
        examine.forEach((e)=> User[e]=req.body[e])
        await User.save();
        res.send(User);
    }catch(e){
      res.status(500).send(e.message);
    }
     
  })

  
Router.delete('/users/:id',async (req,res)=>{
    const id =req.params.id;
    try{
        new ObjectId(id);
    }catch(e){
     return res.status(400).send()
    }
 
    try{
       const userd= await user.findByIdAndDelete(id)
       if(!userd)return res.status(404).send()
       res.send(userd)
 
    }catch(e){
        res.status(500).send(e)
    }
 })

 module.exports=Router;
