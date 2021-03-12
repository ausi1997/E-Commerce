const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:[2, 'Name should be more than 2 characters'],
        max:[32, 'Name should be less than 32 characters']
    },
    lastName:{
        type:String,
        required:true,
        min:[2, 'Name should be more than 2 characters'],
        max:[32, 'Name should be less than 32 characters']
    },
    email:{
        type:String,
        required:true,
        unique:true,   // email should be unique for everyone
        index:true,    // it can be queried by email
        lowercase:true
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
       // enum:['user', 'admin'],   // enum creates a validator to check value is given in an array or not
        default:'user'
    },
    contactNumber:{
        type:Number
    },
    avatar:{ // user image
        type:String
    },
    history:{ // it will store a user order history
        type:Array,
        default:[]
    },
    timestamps:{
        type:Date,
        default:Date.now()
    }
});

// creating user model
mongoose.model('user',userSchema);  // defines collection name where we will insert this all data

// exporting the model
module.exports = mongoose.model('user');