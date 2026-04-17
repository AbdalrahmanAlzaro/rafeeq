const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User, School, Teacher, Parent, ChildProfile } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const { generateOTP, getOTPExpiry, sendOTP } = require('../utils/sendOTP');
const jwt = require('jsonwebtoken');

// Temporary in-memory OTP store (replace with DB/Redis in production)
const otpStore = {};

const register = async (req, res) => {
  try {
    const { role, national_id, phone, email, password, language,
            // school fields
            name_ar, name_en, location, description, contact_phone,
            // teacher fields
            school_id, full_name_ar, full_name_en, specialization,
            // parent fields (reuses full_name_ar, full_name_en)
          } = req.body;

    if (!role || !phone) {
      return res.status(400).json({ message: 'role and phone are required' });
    }

    const password_hash = password
      ? await bcrypt.hash(password, 10)
      : await bcrypt.hash(uuidv4(), 10);

    const user = await User.create({
      id: uuidv4(),
      role,
      national_id: national_id || null,
      phone,
      email: email || null,
      password_hash,
      language: language || 'ar',
    });

    if (role === 'school') {
      if (!name_ar || !location) {
        await user.destroy();
        return res.status(400).json({ message: 'name_ar and location are required for school' });
      }
      await School.create({
        id: uuidv4(),
        user_id: user.id,
        name_ar,
        name_en: name_en || null,
        location,
        description: description || null,
        contact_phone: contact_phone || null,
      });
    } else if (role === 'teacher') {
      if (!school_id || !full_name_ar) {
        await user.destroy();
        return res.status(400).json({ message: 'school_id and full_name_ar are required for teacher' });
      }
      await Teacher.create({
        id: uuidv4(),
        user_id: user.id,
        school_id,
        full_name_ar,
        full_name_en: full_name_en || null,
        specialization: specialization || null,
      });
    } else if (role === 'parent') {
      if (!full_name_ar) {
        await user.destroy();
        return res.status(400).json({ message: 'full_name_ar is required for parent' });
      }
      await Parent.create({
        id: uuidv4(),
        user_id: user.id,
        full_name_ar,
        full_name_en: full_name_en || null,
      });
    }
    // 'child' role: child_profiles created separately by teacher

    const otp = generateOTP();
    const expiry = getOTPExpiry();
    otpStore[phone] = { otp, expiry };
    await sendOTP(phone, otp);

    res.status(201).json({ message: 'Registered successfully. OTP sent to phone.', user_id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { national_id } = req.body;
    if (!national_id) return res.status(400).json({ message: 'national_id is required' });

    const user = await User.findOne({ where: { national_id } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.is_active) return res.status(403).json({ message: 'Account is inactive' });

    const otp = generateOTP();
    const expiry = getOTPExpiry();
    otpStore[user.phone] = { otp, expiry };
    await sendOTP(user.phone, otp);

    res.json({ message: 'OTP sent to phone', phone: user.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: 'phone and otp are required' });

    const record = otpStore[phone];
    if (!record) return res.status(400).json({ message: 'OTP not found or expired' });
    if (Date.now() > record.expiry) {
      delete otpStore[phone];
      return res.status(400).json({ message: 'OTP expired' });
    }
    if (record.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    delete otpStore[phone];

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    res.json({ accessToken, refreshToken, role: user.role, user_id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'phone is required' });

    const user = await User.findOne({ where: { phone } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = generateOTP();
    const expiry = getOTPExpiry();
    otpStore[phone] = { otp, expiry };
    await sendOTP(phone, otp);

    res.json({ message: 'OTP resent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'token is required' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profile = null;
    if (user.role === 'school') {
      profile = await School.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'parent') {
      profile = await Parent.findOne({ where: { user_id: user.id } });
    } else if (user.role === 'child') {
      profile = await ChildProfile.findOne({ where: { user_id: user.id } });
    }

    res.json({ user, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, verifyOTP, resendOTP, refreshToken, getMe };
