const mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/e-commerce', {useNewUrlParser:true, useUnifiedTopology:true,useCreateIndex:true},(err)=>{
// check error   
if(err){
        console.log('DB Connection fails' +err);
    }
    // if ok
    else{
   console.log('DB is Connected....');
    }
});