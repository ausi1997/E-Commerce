const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');


const Category = require('../models/categorymodel');

const slugify = require('slugify');


function createCategories(categories, parentId){
    const categoryList = []; // empty array to store the category list
    let category;
    if(parentId == null){   // if this is null then fetch the parent level category
        category = categories.filter(cat=> cat.parentId == undefined);
    }
    else{   // if there is parent id then it will fetch the sub-category also in the list
        category = categories.filter(cat=> cat.parentId == parentId);
    }
    for(let cate of category){
        categoryList.push({
            _id:cate._id,        // pushing the data with these property in empty array
            name:cate.name,
            slug:cate.slug,
            children:createCategories(categories, cate._id) // recursive to fetch the sub-category of any sub-category
        });
    }
    return categoryList;
}

// middleware setup
router.use(bodyparser.json());            // configuring the middleware
router.use(bodyparser.urlencoded({extended:true}));  // url encoded with query string lib


// default route
router.all('/', async(req,res)=>{
    try{
        await Category.find()
    return res.json({                             // used async await
        status:true,                              
        message : 'route is working...'
    });
}
catch(err){
    res.json('Error' + err);
}
});

// route to create a category

router.post('/create', async(req,res)=>{
    try{                     // checking the existing category
        await Category.findOne({name:req.body.name}, (errors,category)=>{
            if(category){
                return res.json({
                    message:'Category already exist'
                });
            }
        else if(req.body.parentId){
            Category.create({
                name:req.body.name,
                slug:slugify(req.body.name),
                parentId:req.body.parentId
            }, (error,result)=>{
                if(!error){  // if all ok
                    return res.json({
                        status:true,
                        message:'Sub-Category created successfully... ',
                        result
                    });
                }
                else{  // any error occurs
                    return res.json({
                        status:false,
                        message:'Failed to create sub-category...',
                        error
                    });
                }
            } )
        }
            else{
                Category.create({
                    name:req.body.name,
                    slug:slugify(req.body.name)
                },(error,result)=>{  
                    if(!error){  // if all ok
                        return res.json({
                            status:true,
                            message:'Category created successfully... ',
                            result
                        });
                    }
                    else{  // any error occurs
                        return res.json({
                            status:false,
                            message:'Failed to create category...',
                            error
                        });
                    }
                })
            }
        })
    }
    catch(err){
        return res.json('error'+ err);
    }
});

// route to find the category

router.get('/findCategory', async(req,res)=>{
    try{
        await Category.find({}, (error,categories)=>{    // finding the category
            if(categories){ // if all ok
                 
                 const categoryList = createCategories(categories);
                             // calling a recursive function to fetch the sub-categories in parent-category
                return res.json({
                    status:true,
                    message:'Founded the category...',
                    categoryList
                });
            }
            else{ // any error occurs
                return res.json({
                    status:true,
                    message:'Failed to found the category...',
                    error
                });
            }
        });
    }
    catch(err){
        return res.json('error'+ err);
    }
}); 

 // route to delete any category

 router.delete('/delete', async(req,res)=>{
    try{                              // deleting finding by name
        await Category.deleteOne({name:req.body.name},(error,result)=>{
           if(!error){    // if all ok
               return res.json({
                   status:true,
                   message:'Category Deleted... ',      
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


// exporting the router
module.exports=router;

