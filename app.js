const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

const orderRouter = require('./routers/order-Router');
const authRouter = require('./routers/auth-Router');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    console.log("Accessed");
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'Get, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-control-Allow-Headers', 'Content-Type , Authorization')
    next()
})


app.use('/auth',authRouter);
//app.use('/user',orderRouter);
app.use('/order', orderRouter);

app.use((err, req, res, next) =>{
   // console.log(err);
    const code = err.code || 500
    //console.log(req)
    res.status(401).json({
        message: err.message,
        status: false
    })
})

//sJGd6YJleO5g2ZoP
//sJGd6YJleO5g2ZoP
const uri = process.env.Mongodb_Api 

mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT || 8080);
        console.log("db Connected u can work now");
    })
    .catch(() => {
        console.log("Database connection error");
    }) 
 
//sJGd6YJleO5g2ZoP