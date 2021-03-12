const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    cartItem:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
            quantity:{
                type:Number,
                default:1
            },
            price:{
                type:Number,
                required:true
            }
        }
    ]
},

{
    timestamps:true
});

// creating cart model
mongoose.model('cart',cartSchema);  // defines collection name where we will insert this all data

// exporting the model
module.exports = mongoose.model('cart');