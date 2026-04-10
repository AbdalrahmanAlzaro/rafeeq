const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  verifyOTP,
  login,
  requestOTP,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/request-otp", requestOTP);
router.post("/refresh-token", refreshToken);
router.post("/reset-password", resetPassword);

router.get("/me", auth, getMe);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;
