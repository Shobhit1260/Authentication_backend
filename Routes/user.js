const express= require('express');
const router = express.Router();

const {sendOtp} = require('../controller/usercontroller')
router.route('/send-otp').post(sendOtp);
module.exports = router;