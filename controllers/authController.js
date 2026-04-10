const { User } = require("../models");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const { generateOTP, getOTPExpiry, sendOTP } = require("../utils/sendOTP");
const jwt = require("jsonwebtoken");

const loginWithNationalId = async (req, res) => {
  try {
    const { national_id } = req.body;

    if (!national_id) {
      return res.status(400).json({ message: "National ID is required" });
    }

    const user = await User.findOne({ where: { national_id } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this National ID" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const otp = generateOTP();
    const otp_expires_at = getOTPExpiry();

    await user.update({ otp_code: otp, otp_expires_at });
    await sendOTP(user.phone, otp);

    return res.status(200).json({
      message: "OTP sent to your registered phone number",
      user_id: user.id,
      phone: maskPhone(user.phone),
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
    const { national_id, otp } = req.body;

    if (!national_id || !otp) {
      return res
        .status(400)
        .json({ message: "National ID and OTP are required" });
    }

    const user = await User.findOne({ where: { national_id } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this National ID" });
    }

    if (!user.otp_code) {
      return res
        .status(400)
        .json({ message: "No OTP requested. Please login first." });
    }

    if (user.otp_code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp_expires_at)) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    await user.update({
      is_verified: true,
      otp_code: null,
      otp_expires_at: null,
    });

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
        national_id: user.national_id,
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

const resendOTP = async (req, res) => {
  try {
    const { national_id } = req.body;

    if (!national_id) {
      return res.status(400).json({ message: "National ID is required" });
    }

    const user = await User.findOne({ where: { national_id } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account found with this National ID" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const otp = generateOTP();
    const otp_expires_at = getOTPExpiry();

    await user.update({ otp_code: otp, otp_expires_at });
    await sendOTP(user.phone, otp);

    return res.status(200).json({
      message: "OTP resent successfully",
      phone: maskPhone(user.phone),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const register = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      phone,
      email,
      national_id,
      role,
      school_id,
      grade_en,
      grade_ar,
      section_en,
      section_ar,
    } = req.body;

    if (!name_en || !phone || !national_id || !role) {
      return res.status(400).json({
        message: "name_en, phone, national_id and role are required",
      });
    }

    const validRoles = ["parent", "teacher", "school_admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingNID = await User.findOne({ where: { national_id } });
    if (existingNID) {
      return res
        .status(409)
        .json({ message: "National ID already registered" });
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

    const otp = generateOTP();
    const otp_expires_at = getOTPExpiry();

    const user = await User.create({
      name_en,
      name_ar: name_ar || null,
      phone,
      email: email || null,
      password_hash: "N/A",
      national_id,
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
      phone: maskPhone(phone),
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
        national_id: req.user.national_id,
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

const maskPhone = (phone) => {
  if (!phone || phone.length < 6) return phone;
  return phone.slice(0, 4) + "****" + phone.slice(-3);
};

module.exports = {
  register,
  loginWithNationalId,
  verifyOTP,
  resendOTP,
  refreshToken,
  getMe,
  updateProfile,
};
