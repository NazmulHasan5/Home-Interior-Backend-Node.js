const mongoose = require("mongoose");
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    phone : {
        type: Number
    },
    address: {
      type: String  
    },
    balance :{
        type : Number,
        default: 100000.00

    },
    authenticate:{
        type: Boolean,
        default : false
    },
    authCode:{
        type: Number
    },
    orders:[
        { 
            price:{ type: Number}, orderId: {type: Number} , orderDate:{type : String}
        }
    ]
},{timestamps : true})


module.exports = mongoose.model("users", userSchema);