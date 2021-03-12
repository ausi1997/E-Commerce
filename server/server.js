const express = require('express');    // importing the express module
const db = require('./models/db');
const app = express();
const userControl = require('./controllers/usercontrol');
const categoryControl = require('./controllers/category');
const adminControl = require('./controllers/adminControl');
const productControl = require('./controllers/productControl');
const cartControl = require('./controllers/cartControl');
// default route
app.all('/', (req,res)=>{
    res.send('Ready to build e-commerce website');
});

// user route

app.use('/user', userControl);

// admin route

app.use('/admin', adminControl);

// category route
app.use('/category', categoryControl);

// product route
app.use('/product', productControl);

// cart route
app.use('/cart', cartControl);

app.listen(5000, ()=>{  // assinging the port
    console.log('Server running on port no. 5000');
});