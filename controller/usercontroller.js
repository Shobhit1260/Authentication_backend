const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const OtpModel = require('../models/phoneuser');
const otpGenerator= require('otp-generator');
const ErrorHandler = require('../utils/errorHandlers');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// @ts-ignore
const twilioClient = new twilio(accountSid, authToken);

exports.sendOtp=catchAsyncErrors(async(req,res,next)=>{
    const {phoneNumber}=req.body;
    const currDate= new Date();
    const otp= otpGenerator.generate(6,{upperCaseAlphabets:false,lowerCaseAlphabets:false,specialChars:false});
    await OtpModel.findOneAndUpdate(
        {phoneNumber},
        {otp,otpExpiration:new Date(currDate.getTime()+ 5*60*1000)},
        {upsert:true,new:true,setDefaultsOnInsert: true}
    );
    try{
    await twilioClient.messages.create({
        body:`Your OTP is : ${otp}`,
        to: phoneNumber,
        from: process.env.TWILIO_MOBILE_NO
    });

        return res.status(200).json({
        success:true,
        msg:"otp send successfully"
    });
}
catch(error){
    next (new ErrorHandler("Failed to send Otp."))
}
})

