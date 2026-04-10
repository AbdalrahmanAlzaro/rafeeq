const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  loginWithNationalId,
  verifyOTP,
  resendOTP,
  refreshToken,
  getMe,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", loginWithNationalId);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/refresh-token", refreshToken);

router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);

module.exports = router;
