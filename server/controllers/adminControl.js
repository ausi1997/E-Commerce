const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyparser = require('body-parser');
// check validation for requests

const {check, validationResult}= require('express-validator');
// models
const Admin = require('../models/adminmodel');
//const usermodel = require('../models/usermodel');


// middleware setup
router.use(bodyparser.json());            // configuring the middleware
router.use(bodyparser.urlencoded({extended:true}));  // url encoded with query string lib


// default route
router.all('/',async(req,res)=>{
    try{
        await Admin.find()
    return res.json({                             // used async await
        status:true,                              
        message : 'route is working...'
    });
}
catch(err){
    res.json('Error' + err);
}
});

// route for admin register

router.post('/register',
    [// check not empty fields
    check('firstName').not().isEmpty().trim().escape(),
    check('lastName').not().isEmpty().trim().escape(),
    check('password').not().isEmpty().trim().escape(),
    check('email').isEmail().normalizeEmail()      // trim will sanitize it

],
async(req,res)=>{  // finding any user of same email
     try{
          await Admin.findOne({email:req.body.email})
       .exec((errors, admin)=>{
           if(admin){
               return res.json({
                   message:'admin already registered'
               });
           }
       else{
    // check validation errors
    const error = validationResult(req);  // passing the req object in the validation method
        if(error.isEmpty()){
        // output data to user also creating it into the database
               Admin.create({
                   firstName:req.body.firstName,
                   lastName:req.body.lastName,
                   email:req.body.email,
                   password:bcrypt.hashSync(req.body.password, 8),   // hashing the password using bcryptjs
                   contactNumber:req.body.contactNumber,
                   avatar:req.body.avatar,
                   role:'admin'
                },  (errors,result)=>{
                      if(!errors){  // all ok
                          return res.json({
                              status:true,
                              message : 'Registered Successfully...',
                              result:result
                          });
                      }
                      else{   // any error occur
                          return res.json({
                              status: false,
                              message: 'Registration Failed...',
                              errors:errors
                          });
                      }
               }
               
               )
            }
            else{
                // display the error message
              return res.json({
                  status:false,
                  message:'validation error',
                  error:error.array()    // store the error in array
              });
            
            }
     } 
     });
    }
        catch(err){
        return res.json('error'+ err);
        }
    });

    // route for admin signIn

    router.post('/signIn', [
        // check not empty fields
        check('password').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail() 
    ],  async(req,res)=>{
        try{// check validation errors
            const error = await validationResult(req);
            if(!error.isEmpty()){
                return res.json({
                    status:false,
                    message:'Validation error',
                    error:error.array()
                });
            }
            else{
            // check email exists or not
            Admin.findOne({email:req.body.email}, (errors,result)=>{
                // check error
                if(errors){
                  return res.json({
                      status:true,
                      message:'email does not exist',
                      errors:errors
                  });
                }
                // result is empty or not
                if(result){
                    // when result ha ssome doc
                    // then match the password
                    const match = bcrypt.compareSync(req.body.password, result.password);
                    // check password is match or not
                    if(match){
                        // password matched
                        let token = jwt.sign({_id:result._id, role:result.role}, 'verySecretValue', {expiresIn: '1h'});
                   //     const {firstName, lastName ,email,role} = result; 
                        return res.json({
                            status:true,
                            message:'Password matched.... login success....',
                            result:result,
                            token:token  // it give the token in result
                        });
                    }
                    else{
                        // password not matched
                        return res.json({
                            status:false,
                            message:'Password do not matched....   login failed...',
                        });
                    }
                }
                else{
                    // user doc doesnot exist
                    return res.json({
                        status:false,
                        message:'admin not exist....'
                    });
                }
            });
        }
        }
        catch(err){
            return res.json('error'+err);
        }
    
    });

    // route for updating the info of any admin

    router.put('/updateInfo/:email', async(req,res)=>{
        try{
            await Admin.updateOne({email:req.params.email},  // by finding email we can update the info
                {firstName:req.body.firstName,
                 lastName:req.body.lastName,
                 password:bcrypt.hashSync(req.body.password, 8),   // hashing the password
                 avatar:req.body.avatar,
                 contactNumber:req.body.contactNumber 
                }, (error,result)=>{
                    if(!error){ // if all ok
                        return res.json({
                            status:true,
                            message:'Successfully updated....',
                            result
                        });
                    }
                    else{ // any error
                        return res.json({
                            status:false,
                            message:'Updation Failed....',
                            error
                        });
                    }
                });
        }
        catch(err){
            return res.json('error' + err);
        }
    });

    // route to delete any user unfo

     router.delete('/delete', async(req,res)=>{
         try{                              // deleting finding by email
             await Admin.deleteOne({email:req.params.email},(error,result)=>{
                if(!error){    // if all ok
                    return res.json({
                        status:true,
                        message:'User Deleted... ',      
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

