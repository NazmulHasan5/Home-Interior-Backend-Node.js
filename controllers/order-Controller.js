const jwt = require("jsonwebtoken");
const User = require("../models/User-Model");

const secureCode = "Interior Backend";

exports.orderPost = (req, res, next) =>{
   const{token, price} = req.body;

   try{
        
        decodedToken = jwt.verify(token,secureCode);
        
        if(!decodedToken){
            const error = new Error();
            error.code = 401;
            error.message = "Invalid Token"; 
            throw error;
            
        }
        else{
            const userId = decodedToken.userId
            console.log(decodedToken);
            User.findById(userId)
                .then(user =>{
                    if(!user){
                        return res.status(401).json({
                            message: "Invalid User",
                            status: false
                        })
                    }

                        const newToken = jwt.sign({
                            email: user.email,
                            userId: user._id.toString()
                            },
                            secureCode,{
                                expiresIn: "7d"
                            })
                            const orderId = Math.floor(100000 + Math.random() * 900000)


                            
                            const d = new Date();
                            const hour = d.getUTCHours() + 6;
                            let time;
                            
                            if(hour >= 12){
                               
                                time = hour +":"+d.getUTCMinutes()+" PM"
                            }
                            else{
                               
                               time = hour +":"+d.getUTCMinutes() + " AM";
                            }
                            const date = d.getUTCDate() +"-"+d.getUTCMonth()+"-"+d.getUTCFullYear() ;
                            console.log(date +" " + time)

                        

                        user.balance -= price;
                        user.orders.push({orderId: orderId, price: price, orderDate: date +" " +time});
                        
                        user.save().then( response =>{
                            console.log(response.orders);
                            res.status(200).json({
                                message: "Order Places",
                                status: true,
                                token: newToken,
                                balance: response.balance,
                                orders: response.orders,
                                auth: response.authenticate,
                                name: response.name,
                                email: response.email,
                                
                            })
                        })
                           
                
                })
                .catch( err =>{
                    //console.log(err);
                    res.status(401).json({
                        message: "Database Connection error",
                        status: false,
                    })
                })
        }
    }
    catch(error){
        console.log(error);
        if(!error.code){
            error.code = 401 
            error.message = "Unauthorized Token"
        }
        next(error);
    }
}


exports.putOrderList = (req, res, next) =>{
    const{token, price} = req.body;
 
    try{
         
         decodedToken = jwt.verify(token,secureCode);
         
         if(!decodedToken){
             const error = new Error();
             error.code = 401;
             error.message = "Invalid Token"; 
             throw error;
             
         }
         else{
             const userId = decodedToken.userId
             
             User.findById(userId)
                 .then(user =>{
                     if(!user){
                         return res.status(401).json({
                             message: "Invalid User",
                             status: false
                         })
                     }
 
                         const newToken = jwt.sign({
                             email: user.email,
                             userId: user._id.toString()
                             },
                             secureCode,{
                                 expiresIn: "7d"
                             })

                             
                        
                             res.status(200).json({
                                 message: "Order List",
                                 status: true,
                                 token: newToken,
                                 orders: user.orders
                             })
                       

                 })
                 .catch( err =>{
                     //console.log(err);
                     res.status(401).json({
                         message: "Database Connection error",
                         status: false,
                     })
                 })
         }
     }
     catch(error){
         console.log(error);
         if(!error.code){
             error.code = 401 
             error.message = "Unauthorized Token"
         }
         next(error);
     }
 }
 
 