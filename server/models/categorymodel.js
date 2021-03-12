const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    parentId:{
        type:String
    }
},
{
    timestamps:true
}
);

// creating category model
mongoose.model('category',categorySchema);  // defines collection name where we will insert this all data

// exporting the model
module.exports = mongoose.model('category');
