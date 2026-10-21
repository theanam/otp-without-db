const assert  = require("assert");
const otpTool = require("./index");

const phone   = "8801711223344";
const key     = "verysecret";
const otp     = 1234;

let hash = otpTool.createNewOTP(phone,otp,key);

assert.strictEqual(hash.split(".").length, 3, "hash should be hash.expires.salt");
assert.strictEqual(otpTool.verifyOTP(phone,otp,hash,key), true, "correct otp should verify");
assert.strictEqual(otpTool.verifyOTP(phone,9999,hash,key), false, "wrong otp should fail");
assert.strictEqual(otpTool.verifyOTP("0000000000",otp,hash,key), false, "wrong phone should fail");
assert.strictEqual(otpTool.verifyOTP(phone,otp,hash,"wrongkey"), false, "wrong key should fail");

// Malformed or missing hash must return false, never throw
assert.strictEqual(otpTool.verifyOTP(phone,otp,undefined,key), false, "undefined hash should fail");
assert.strictEqual(otpTool.verifyOTP(phone,otp,null,key), false, "null hash should fail");
assert.strictEqual(otpTool.verifyOTP(phone,otp,12345,key), false, "numeric hash should fail");
assert.strictEqual(otpTool.verifyOTP(phone,otp,"",key), false, "empty hash should fail");
assert.strictEqual(otpTool.verifyOTP(phone,otp,"abc",key), false, "hash without parts should fail");
assert.strictEqual(otpTool.verifyOTP(phone,otp,"abc.123",key), false, "hash missing salt should fail");

// Expired hash must fail
let expired = otpTool.createNewOTP(phone,otp,key,-1);
assert.strictEqual(otpTool.verifyOTP(phone,otp,expired,key), false, "expired hash should fail");

// Tampered expiry must fail even if it is in the future
let [h,e,s] = hash.split(".");
let tampered = `${h}.${Number(e)+600000}.${s}`;
assert.strictEqual(otpTool.verifyOTP(phone,otp,tampered,key), false, "tampered expiry should fail");

console.log("All tests passed");
