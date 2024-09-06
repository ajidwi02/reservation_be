// routes/authRoutes.js
const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Perbaiki impor middleware
const router = express.Router();

// Rute untuk register
router.post(
  "/register",
  [
    check("username", "Nama pengguna diperlukan").not().isEmpty(),
    check("email", "Masukkan email yang valid").isEmail(),
    check("password", "Kata sandi harus minimal 6 karakter").isLength({
      min: 6,
    }),
  ],
  authController.register
);

// Rute untuk login
router.post(
  "/login",
  [
    check("email", "Masukkan email yang valid").isEmail(),
    check("password", "Kata sandi diperlukan").exists(),
  ],
  authController.login
);

// Rute untuk mendapatkan informasi pengguna
router.get("/user", authMiddleware, authController.getUser);

module.exports = router;
