const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');

const Product = require('../models/productmodel');

const slugify = require('slugify');

const multer = require('multer');

const path = require('path');

const shortid = require('shortid');

const requireSignIn = require('../middleware/authentication');

const adminMiddleware = require('../middleware/authentication');

// middleware setup
router.use(bodyparser.json());            // configuring the middleware
router.use(bodyparser.urlencoded({extended:true}));  // url encoded with query string lib


// default route
router.all('/', requireSignIn, async(req,res)=>{
    try{
        await Product.find()
       return res.json({                             // used async await
            status:true,                              
            message : 'route is working...'
        });
    
}
catch(err){
    res.json('Error' + err);
}
});

// creating a storage where product images will be stored

        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, path.join(path.dirname(__dirname), 'uploads')) // joining the dir path
            },
            filename: function (req, file, cb) {    // generating a id for file name
              cb(null, shortid.generate()+ '-' + file.originalname)
            }
          });
          const upload = multer({storage});

          // route to create products

router.post('/createProduct', upload.array('productPictures'), async(req,res)=>{
    let productPictures = [];  // taking the empty array to store the multuiple image files
    if(req.files.length>0){
      productPictures = req.files.map(file=>{ // using map method for iterating the array
          return {
              img:file.filename
          }
      }) 
    }

//});
    try{
         await Product.create({
             name:req.body.name,
             slug:slugify(req.body.name),
             category:req.body.category,
             price:req.body.price,
             description:req.body.description,
             productPictures
         }, (error,product)=>{
                if(product){  
                    return res.json({
                        status:true,
                        message:'product added successfully...',
                        product
                    });
                }
                else{
                    return res.json({
                        status:false,
                        message:'Failed...',
                        error
                    });
                }
         })
    }
    catch(err){
        return res.json('error' +err);
    }
});

// route to delete any product

router.delete('/deleteProduct', async(req,res)=>{
    try{                              // deleting finding by name
        await Product.deleteOne({name:req.body.name},(error,result)=>{
           if(!error){    // if all ok
               return res.json({
                   status:true,
                   message:'Product Deleted... ',
                   result
               });
           }
           else{    // any error
               return res.json({
                   status:false,
                   message:'Failed...'
               });
           }
        });
    }
    catch(err){
        return res.json('error' +err);
    }
});




// exporting the routr
module.exports=router;