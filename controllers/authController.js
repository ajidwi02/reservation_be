// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const authMiddleware = require('../middleware/authMiddleware');

// Fungsi registrasi
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    res
      .status(201)
      .json({ message: "Pengguna berhasil dibuat", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan saat membuat pengguna", error });
  }
};

// Fungsi login untuk admin
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Cek apakah password cocok
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Invalid credentials' 
      });
    }

    // Cek jika user adalah admin
    if (user.role !== 'admin') {
      return res.status(403).json({ 
        status: 'error',
        message: 'Akses ditolak. Hanya admin yang dapat login.' 
      });
    }

    // Membuat token JWT dengan informasi role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '720h' }
    );

    // Kirimkan response dengan status message dan data yang mencakup username, email, dan token
    res.json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        username: user.username,
        email: user.email,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error logging in',
      error: error.message
    });
  }
};

exports.getUser = (req, res) => {
  res.json({ user: req.user });
};
