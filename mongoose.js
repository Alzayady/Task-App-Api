const mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/taskapp',{useCreateIndex:true,useNewUrlParser:true,}).then(()=>{
    console.log('connected to database')
}).catch((e)=>{
console.log(e)
})



