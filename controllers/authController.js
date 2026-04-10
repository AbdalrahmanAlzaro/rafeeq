const bcrypt = require("bcryptjs");
const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { generateOTP, getOTPExpiry, sendOTP } = require("../utils/sendOTP");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      phone,
      email,
      password,
      national_id,
      role,
      school_id,
      grade_en,
      grade_ar,
      section_en,
      section_ar,
    } = req.body;

    if (!name_en || !phone || !password || !role) {
      return res
        .status(400)
        .json({ message: "name_en, phone, password and role are required" });
    }

    const validRoles = ["parent", "teacher", "school_admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res
        .status(409)
        .json({ message: "Phone number already registered" });
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
    }

    if (national_id) {
      const existingNID = await User.findOne({ where: { national_id } });
      if (existingNID) {
        return res
          .status(409)
          .json({ message: "National ID already registered" });
      }
    }

    const password_hash = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otp_expires_at = getOTPExpiry();

    const user = await User.create({
      name_en,
      name_ar: name_ar || null,
      phone,
      email: email || null,
      password_hash,
      national_id: national_id || null,
      role,
      school_id: school_id || null,
      grade_en: grade_en || null,
      grade_ar: grade_ar || null,
      section_en: section_en || null,
      section_ar: section_ar || null,
      otp_code: otp,
      otp_expires_at,
      is_verified: false,
      is_active: true,
    });

    await sendOTP(phone, otp);

    return res.status(201).json({
      message: "Registration successful. OTP sent to your phone.",
      user_id: user.id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    await user.update({
      is_verified: true,
      otp_code: null,
      otp_expires_at: null,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Phone verified successfully",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name_en: user.name_en,
        name_ar: user.name_ar,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res
        .status(400)
        .json({ message: "Phone and password are required" });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    if (!user.is_verified) {
      const otp = generateOTP();
      const otp_expires_at = getOTPExpiry();
      await user.update({ otp_code: otp, otp_expires_at });
      await sendOTP(phone, otp);
      return res.status(403).json({
        message: "Account not verified. A new OTP has been sent to your phone.",
        user_id: user.id,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name_en: user.name_en,
        name_ar: user.name_ar,
        phone: user.phone,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        school_id: user.school_id,
        grade_en: user.grade_en,
        grade_ar: user.grade_ar,
        section_en: user.section_en,
        section_ar: user.section_ar,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const otp = generateOTP();
    const otp_expires_at = getOTPExpiry();

    await user.update({ otp_code: otp, otp_expires_at });
    await sendOTP(phone, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
      user_id: user.id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id, is_active: true },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({ accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      user: {
        id: req.user.id,
        name_en: req.user.name_en,
        name_ar: req.user.name_ar,
        phone: req.user.phone,
        email: req.user.email,
        role: req.user.role,
        avatar_url: req.user.avatar_url,
        school_id: req.user.school_id,
        grade_en: req.user.grade_en,
        grade_ar: req.user.grade_ar,
        section_en: req.user.section_en,
        section_ar: req.user.section_ar,
        is_verified: req.user.is_verified,
        is_active: req.user.is_active,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name_en, name_ar, email, avatar_url } = req.body;

    if (email && email !== req.user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    await req.user.update({
      name_en: name_en || req.user.name_en,
      name_ar: name_ar !== undefined ? name_ar : req.user.name_ar,
      email: email !== undefined ? email : req.user.email,
      avatar_url: avatar_url !== undefined ? avatar_url : req.user.avatar_url,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: req.user.id,
        name_en: req.user.name_en,
        name_ar: req.user.name_ar,
        email: req.user.email,
        avatar_url: req.user.avatar_url,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;

    if (!old_password || !new_password) {
      return res
        .status(400)
        .json({ message: "old_password and new_password are required" });
    }

    const isMatch = await bcrypt.compare(old_password, req.user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect" });
    }

    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await req.user.update({ password_hash });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { phone, otp, new_password } = req.body;

    if (!phone || !otp || !new_password) {
      return res
        .status(400)
        .json({ message: "phone, otp and new_password are required" });
    }

    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const password_hash = await bcrypt.hash(new_password, 10);

    await user.update({
      password_hash,
      otp_code: null,
      otp_expires_at: null,
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  register,
  verifyOTP,
  login,
  requestOTP,
  refreshToken,
  getMe,
  updateProfile,
  changePassword,
  resetPassword,
};
