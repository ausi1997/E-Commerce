const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        min:[2, 'Name should be more than 2 characters'],
        max:[32, 'Name should be less than 32 characters']
    },
    mobileNumber:{
        type:String,
        required:true,
        trim:true
    },
    pincode:{
        type:String,
        required:true,
        trim:true
    },
    locality:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    districtName:{ // it will store a user order history
        type:String,
        required:true,
        trim:true
    },
    state:{
        type:String,
        required:true,
        trim:true
    },
    landmark:{
        type:String,
        required:true,
        trim:true
    },
    alternateNumber:{
        type:String
    },
    addressType:{
        type:String,
        required:true,
        enum:['home','work']
    }
});
const userAddressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    address:[addressSchema]
},
{
    timestamps:true
});

// creating address model
mongoose.model('userAddress',userAddressSchema);  // defines collection name where we will insert this all data

// exporting the model
module.exports = mongoose.model('userAddress');