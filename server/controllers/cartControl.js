const express = require('express');
const router = express.Router();
const bodyparser = require('body-parser');

const Cart = require('../models/cartmodel');
const requireSignIn = require('../middleware/authentication');


// middleware setup
router.use(bodyparser.json());            // configuring the middleware
router.use(bodyparser.urlencoded({extended:true}));  // url encoded with query string lib

// default route

router.all('/', async(req,res)=>{
try{
    await Cart.find()
    return res.json({
        status:true,
        message:'route is working',
    });
}
catch(err){
    return res.json('error' +err);
}
});

// route to add cartItems

router.post('/add-to-cart', requireSignIn, async(req,res)=>{
    try{
        await Cart.findOne({user:req.user._id}, (cartExist, newCart)=>{
            if(cartExist){
                // if cart already exist then update the cart by the quantity
                const product = req.body.cartItems.product;
                const item = cart.cartItems.find(exist=>exist.product == product);// finding that the product is same or not
                if(item){ // so if we are again adding the same product
                    condition = {"user":req.user._id, "cartItems.product":product};
                    update = {
                        "$set":{
                            "cartItems.$":{cartItems:req.body.cartItems, quantity:item.quantity+req.body.cartItems.quantity}
                        }
                    }
                }
                else{// if we are adding some diff product
                    condition = {user:req.user._id};
                    update = {
                        "$push":{  // pushing the new product in the cartItems array
                            "cartItems":{cartItems:req.body.cartItems}
                        }
                    };
                }
                Cart.findOneAndUpdate(condition,update,(error,updatedCart)=>{
                    if(error){
                        return res.json({error});
                    }
                    else{
                        return res.json({updatedCart});
                    }
                });
            }
            else{
                // if cart not exist for thsat user create new cart
                Cart.create({
                    user:req.user._id,
                    cartItems:[req.body.cartItems]
                }, (error,cart)=>{
                    if(cart){
                        return res.json({
                            status:true,
                            message:'Items added to cart...',
                            cart
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
        })
    }
    catch(err){
return res.json('error'+err);
    }
});




// exporting the router

module.exports=router;