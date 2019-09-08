const jwt=require('jsonwebtoken');
const user=require('../module/user');
const auth=async (req ,res ,next)=>{
  try{
      const token =req.header('Authorization').replace('Bearer ','');
      const data=jwt.verify(token,'qwertyuiop123456789QWERT');
      try{
        await user.findOne({})

      }catch(r){
        
      }
      // if(!User){
      //   throw new Error()
      // }
      // req.User=User;
      next();
  }catch(e){
    res.status(401).send({ error:'Please LogIn'})
  }
  next()

} 
module.exports=auth;