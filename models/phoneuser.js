const mongoose = require('mongoose');
const phoneuser = new mongoose.Schema(
    {
        phoneNumber :{
            type:String,
            required:true
        },
        otp:{
            type:String,
            required:true
        },
        otpExpiration:{
            type:Date,
            default:Date.now(),
            get: (otpExpiration)=>otpExpiration.getTime(),
            set: (otpExpiration)=>new Date(otpExpiration),
        },  
})

module.exports = mongoose.model('Phoneuser',phoneuser);