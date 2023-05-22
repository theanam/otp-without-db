const otpTool = require("./index");

const phone   = "8801711223344";
const key     = "verysecret";
const otp     = 1234;



let hash     = otpTool.createNewOTP(phone,otp,key);
let verified = otpTool.verifyOTP(phone,otp,hash,key);

console.log(`Your verification status is ${verified}`);
