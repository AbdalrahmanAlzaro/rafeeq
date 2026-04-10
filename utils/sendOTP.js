const crypto = require("crypto");

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const getOTPExpiry = () => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
};

const sendOTP = async (phone, otp) => {
  console.log(`OTP for ${phone}: ${otp}`);
};

module.exports = { generateOTP, getOTPExpiry, sendOTP };
