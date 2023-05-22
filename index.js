/**
 * OTP Utility Functions, which has two functions.
 * `createNewOTP` is responsible to create a new otp
 * `verifyOTP` verifies the generated otp
 * @module OTPUtils
 */
const crypto = require("crypto");


/**
 * Creates a new OTP (One-Time Password) hash for the given phone number.
 * @param {string} phone - The phone number for which OTP is being generated.
 * @param {string} otp - The OTP (One-Time Password) to be associated with the phone number.
 * @param {string} [key=""] - The secret key used for hashing the OTP data.
 * @param {number} [expiresAfter=5] - The number of minutes after which the OTP expires.
 * @param {string} [algorithm="sha256"] - The hashing algorithm to be used.
 * @returns {string} - The generated OTP hash.
 */
function createNewOTP(phone,otp,key="",expiresAfter=5,algorithm="sha256"){
    const ttl      = expiresAfter * 60 * 1000; //Expires after in Minutes, converteed to miliseconds
    const expires  = Date.now() + ttl; //timestamp to 5 minutes in the future
    const data     = `${phone}.${otp}.${expires}`; // phone.otp.expiry_timestamp
    const hashBase = crypto.createHmac(algorithm,key).update(data).digest("hex"); // creating SHA256 hash of the data
    const hash     = `${hashBase}.${expires}`; // Hash.expires, format to send to the user
    // you have to implement the function to send SMS yourself. For demo purpose. let's assume it's called sendSMS
    return hash;
}


/**
 * Verifies the OTP (One-Time Password) hash for the given phone number and OTP value.
 * @param {string} phone - The phone number for which OTP is being verified.
 * @param {string} otp - The OTP (One-Time Password) to be verified.
 * @param {string} hash - The OTP hash received from the user.
 * @param {string} [key=""] - The secret key used for hashing the OTP data.
 * @param {string} [algorithm="sha256"] - The hashing algorithm to be used.
 * @returns {boolean} - Whether the OTP is verified or not.
 */
function verifyOTP(phone,otp,hash,key="",algorithm="sha256"){
    if(!hash.match(".")) return false; // Hash should have at least one dot
    // Seperate Hash value and expires from the hash returned from the user(
    let [hashValue,expires] = hash.split(".");
    // Check if expiry time has passed
    let now = Date.now();
    if(now>expires) return false;
    // Calculate new hash with the same key and the same algorithm
    let data  = `${phone}.${otp}.${expires}`;
    let newCalculatedHash = crypto.createHmac(algorithm,key).update(data).digest("hex");
    // Match the hashes
    if(newCalculatedHash === hashValue){
        return true;
    } 
    return false;
}

module.exports = {
    createNewOTP,
    verifyOTP
}