const User = require('../models/User-Model');
const sendGridMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

//sendGridMail.setApiKey('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');
sendGridMail.setApiKey(process.env.Mail_Api)

const secureCode = "Interior Backend";

exports.putSignup = (req, res, next) => {
    const { name, email, password} = req.body;

    console.log(req.body);

    const sixdigitsAuth = Math.floor(100000 + Math.random() * 900000)

    console.log(sixdigitsAuth);
    
    const newUser = new User({
        name: name,
        email: email,
        password: password,
        authCode: sixdigitsAuth
    })

    newUser.save()
        .then((response) => {
            
            const newToken = jwt.sign(
                {
                    email: email,
                    userId: response._id.toString()
                },
                secureCode
                ,{
                    expiresIn: "1h"
                }
            )

            console.log("Json Web Token: " + newToken)
            console.log("Response data: " +response)

            res.status(200).json({
                message: "Signup Completed",
                token: newToken,
                status: true
            });

            sendGridMail.send({
                to: email,
                from: "nazmulimm@gmail.com",
                subject: "Auth Code",
                html: `<strong>Code: ${sixdigitsAuth}</strong>`

            })
        })
        .catch((err) => {
            console.log(err);
            res.status().json({
                message: "DataBase Error"
            });
        })

}

exports.putLogin = (req, res, next) => {
    const { email, password } = req.body;

    //console.log(req);
    console.log(email, password);

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log("Check1");
                return res.status(401).json({
                    message: "Invalid User name or password",
                    status: false
                })
            } 
            if (user.password != password) {
                console.log("Check2");
                return res.status(401).json({
                    message: "Invalid User email or password",
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

            //console.log(newToken);

            res.status(200).json({
                message: "Login Successful",
                status: true,
                token: newToken,
                auth: user.authenticate,
                name: user.name,
                email: user.email,
                balance: user.balance,
                orders: user.orders
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({
                message: "Database Error",
                status: false
            })
        })
}

exports.putProfile = (req, res, next) => {

}

exports.putAuthUser = (req, res, next) => {
    
    const {authCode, token} = req.body

    let decodedToken;

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

                    if(authCode != user.authCode){
                        return res.status(401).json({
                            message: "Invalid Authentication Code",
                            status: false
                        })
                    }

                    user.authenticate = true;

                    user.save()
                        .then( response =>{
                            const newToken = jwt.sign({
                                email: response.email,
                                userId: response._id.toString()
                            },
                            secureCode,{
                                expiresIn: "7d"
                            })
                            res.status(200).json({
                                message: "Authenticated Sucessesful",
                                status: true,
                                token: newToken
                            })
                        })
                        .catch(err =>{
                            res.status(401).json({
                                message: "Database insert Error",
                                status: false,
                            })
                        })
                
                })
                .catch( err =>{
                    res.status(401).json({
                        message: "Database Connection error",
                        status: false,
                    })
                })
        }
    }
    catch(error){
        if(!error.code){
            error.code = 401
            error.message = "Unauthorized Token"
        }
        next(error);
    }
   
}

exports.putResendOTP = (req, res, next)=> {
    const {token} = req.body;

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

                    
                   
                    const sixdigitsAuth = Math.floor(100000 + Math.random() * 900000)
                    user.authCode = sixdigitsAuth;

                    sendGridMail.send({
                            to: user.email,
                            from: "nazmulimm@gmail.com",
                            subject: "Auth Code",
                            html: `<strong>Code: ${sixdigitsAuth}</strong>`

                        }).then( r =>{
                            console.log(r);
                        }).catch( r =>{
                            console.log(r);
                        })

                    user.save()
                        .then( response =>{
                            const newToken = jwt.sign({
                                email: response.email,
                                userId: response._id.toString()
                                },
                                secureCode,{
                                    expiresIn: "7d"
                                })
                                res.status(200).json({
                                    message: "Authenticated Sucessesful",
                                    status: true,
                                    token: newToken
                                })
                        })
                        .catch(err =>{
                            res.status(401).json({
                                message: "Database insert Error",
                                status: false,
                            })
                        })
                
                })
                .catch( err =>{
                    console.log(err);
                    res.status(401).json({
                        message: "Database Connection error",
                        status: false,
                    })
                })
        }
    }
    catch(error){
        if(!error.code){
            error.code = 401
            error.message = "Unauthorized Token"
        }
        next(error);
    }
}

exports.putValidateLoginSession = (req, res, next) =>{
    const {token} = req.body;

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

                    if(!user.authenticate){
                        const error = new Error();
                        error.code = 401;
                        error.message = "Not authenticated"; 
                        throw error;
                    }else{
                        const newToken = jwt.sign({
                            email: user.email,
                            userId: user._id.toString()
                            },
                            secureCode,{
                                expiresIn: "7d"
                            })
                            res.status(200).json({
                                message: "Session renew successful",
                                status: true,
                                token: newToken
                            })
                    }            
                })
                .catch( err =>{
                    //console.log(err);
                    res.status(401).json({
                        message: "Database Connection error",
                        status: false
                    })
                })
        }
    }
    catch(error){
        if(!error.code){
            error.code = 401 
            error.message = "Unauthorized Token"
        }
        next(error);
    }
}