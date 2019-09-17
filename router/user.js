
const user=require('../src/module/user')
const Router=require('express').Router()
const {ObjectId}=require('mongodb')
const auth=require('../src/middleware/auth')
const sharp=require('sharp')
const mlter=require('multer')
const upload=mlter({
  limits:{
    fileSize:1*1024*1024
  }, 
  fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(png|jpeg|jpg)$/)){
       return cb(new Error('upload an image'))
        }
        cb(undefined,true)
  }
})


Router.get("/users/My_Profile",auth,async (req,res)=>{
   res.send(req.User)
    })
    
Router.post("/users",async(req,res)=>{
    const data=req.body;
    const User= new user(data);
    const token=await User.GetAuthentiocation();
    User.Tokens=User.Tokens.concat({token});
    try{
     await User.save();
     res.status(201).send({User,token});
    }catch(e){
      res.status(400).send(e.message); 
    }
         
  })


  Router.post('/users/logout',auth,async(req,res)=>{
    try{
    const token=req.token;
    const User=req.User;
    for(var i=0;i<User.Tokens.length;i++){
      if(User.Tokens[i].token===token){
        User.Tokens.splice(i, 1);
        break; 
      }
    }
    await User.save();
    res.send(User);
    }catch(e){
      res.status(500).send(e)

    }
  })

  Router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
     req.User.Tokens=[]
     await req.User.save()
     res.send(req.User)
    }catch(e){
       res.status(500).send(e)
    }
  })

  Router.post('/users/login',async(req,res)=>{
  
    try{
       const User=await user.login(req.body);
       const token=await User.GetAuthentiocation();
       User.Tokens=User.Tokens.concat({token})
       await User.save();
       res.send({User,token});
    }catch(e){
      res.status(400).send(e.message);
    }
  })

  
Router.patch('/users/My_Profile',auth,async (req,res)=>{
    const canChange=["name","password" ,"age" ,"Email"]
    const examine=Object.keys(req.body);
    const isValid= examine.every((update) => canChange.includes(update))
     if(!isValid){res.status(400).send("Invalid Input")}
    try{
        examine.forEach((e)=> req.User[e]=req.body[e])
        await req.User.save();
        res.send(req.User);
    }catch(e){
      res.status(500).send(e.message);
    }
  })

  
Router.delete('/users/My_Profile',auth,async (req,res)=>{
    
    try{
      await req.User.remove()

     res.send(req.User)
    }catch(e){
        res.status(500).send(e)
    }
 })


 Router.post('/users/My_Profile/image',auth,upload.single('profile'),async(req,res)=>{
const buffer=await  sharp(req.file.buffer).resize({width:250,height:250}).jpeg().toBuffer()
   req.User.image=buffer
   await  req.User.save()
   console.log(req.file.buffer)
   res.send()
 },(error , req,res,next)=>{
   res.status(400).send(error.message)
 })



 Router.delete('/users/My_Profile/image',auth,async(req,res)=>{
    req.User.image=undefined;
    await req.User.save()
    res.send(req.User)
 })

 Router.get('/users/:id/image',async(req,res)=>{
   try{
    const User=await user.findById(req.params.id);
    if(!User||!User.image){
      throw new Error ()
    }
    res.set('Content-Type', 'image/jpeg') 
    res.send(User.image)
   }catch(e){
       res.status(404).send()
   }

  

 })
 module.exports=Router;
