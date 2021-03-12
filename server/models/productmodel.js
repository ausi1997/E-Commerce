const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    category:{
         type:mongoose.Schema.Types.ObjectId,
          ref:'category',
          required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    productPictures:[
        {
            img:{
                type:String
               // required:true
            }
        }
    ],
    reviews:[
        {
            userId:{
                type: mongoose.Schema.Types.ObjectId,
                ref:'user'
            },
            review:String
        }
    ]
},
{
    timestamps:true
});

// creating product model
mongoose.model('product',productSchema);  // defines collection name where we will insert this all data

// exporting the model
module.exports = mongoose.model('product');