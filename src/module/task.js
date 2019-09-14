const mongoose=require('mongoose');
const validater=require('validator');

const TaskSchema=new mongoose.Schema({
      description:{
            type:String , 
            required:true,
            trim:true
      },
      complete:{
            type:Boolean,
            default:false,
      },
      owner:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'user'
      }
  },{
        timestamps:true
  })


  
const task =mongoose.model("task",TaskSchema);


module.exports=task;