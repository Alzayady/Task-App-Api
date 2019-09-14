const jwt=require('jsonwebtoken');
const user=require('../module/user');
const auth=async (req ,res ,next)=>{
  try{
    const token=req.header('Authorization').replace('Bearer ' ,'');
    const data=await jwt.verify(token,process.env.SECRET);
    const User=await user.findOne({_id:data._id,'Tokens.token':token})
    if(!User)throw new Error()
    req.User=User;
    req.token=token;
    next();
  }catch(e){
   res.status(401).send("please LogIn")
  }
} 
module.exports=auth;


