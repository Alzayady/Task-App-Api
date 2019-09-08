const mongoose=require('mongoose');
const validater=require('validator');
const bcryptjs=require('bcryptjs');
const jwt=require('jsonwebtoken')
const UserSchem=new mongoose.Schema({
      name:{
            type:String, 
            required:true,
            trim:true,
            lowercase:true,
            validate(v){
                  if(!validater.isAlpha(v)){
                        throw new Error ("Name must contais characters only")
                  }
            }
      }, 
      age:{
            type:Number,
            default:0,
            validate(v){
                  if(v<0)throw new Error ("age must be positive")
            }
      },
      Email:{
            type:String,
            required:true,
            validate(v){
                if(!validater.isEmail(v))throw new Error("invalid email")
            }
      },
      password:{
            type:String, 
            required:true,
            trim:true,
            minlength:6,
            validate(v){
                  var num =0;
                  var alphas=0;
                  var alphac=0;
                  var sp=0
                  for(var i=0;i<v.length;i++){
                       if(v[i]<='9'&&v[i]>='0')num++;
                       else if(v[i]<='z'&&v[i]>='a')alphas++;
                       else if(v[i]<='Z'&&v[i]>='A')alphac++;
                       else sp++;
                 }
                 if(num==0)throw new Error ("password must contain 1 number or more");
                 if(alphas==0)throw new Error ("password must contain 1 small character or more");
                 if(alphac==0)throw new Error ("password must contain 1 capital character or more");
                 if(sp==0)throw new Error ("password must contain 1 special character or more");
                 if(validater.contains(v.toLowerCase(),"password"))throw new Error ("password mustn't contains password");
            }
      },
      Tokens:[{
            token:{
                  type:String,
                  required:true
            }
      }]
  });

  UserSchem.pre('save', async function (next){
     
      if(this.isModified('password')){
           this.password=await bcryptjs.hash(this.password,10);
      }
      const all =await user.find({});
      all.forEach((a)=>{
      if(a.Email===this.Email){
            if(a._id.toString()!==this._id.toString()){
                  console.log(a._id)
                  console.log(this._id)
                  throw new Error('Email must be unique')

            }
      }
      })
      this.Email[0]='A';

      next();
  })

  UserSchem.methods.GetAuthentiocation=async function(){
      return jwt.sign({_id:this._id.toString()},"qwertyuiop123456789QWERT");
  }

  UserSchem.statics.login= async(body)=>{
    const User=await user.findOne({Email:body.Email});
    if(!User){
          throw new Error("Invalid Email")
    }
    const IsValid=await bcryptjs.compare(body.password,User.password);
    if(!IsValid){
          throw new Error("Invalid Password ");
    }
    return User;
  }

  const user=mongoose.model("user",(UserSchem))


module.exports=user;