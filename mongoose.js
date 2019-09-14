const mongoose=require('mongoose');


mongoose.connect(process.env.MONGODB_SECRET_KEY,{
	useNewUrlParser:true,
	useCreateIndex:true
}).then(()=>{
	console.log("connected to Db");
}).catch(err=> {
	console.log("Error",err.message);
});
