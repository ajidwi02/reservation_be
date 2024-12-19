// routes/authRoutes.js
const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("express-rate-limit");
const ExpressBrute = require("express-brute");

const router = express.Router();

// Konfigurasi penyimpanan untuk ExpressBrute (gunakan Redis untuk production)
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, {
  freeRetries: 7, // Maksimum 5 percobaan login
  minWait: 5 * 60 * 1000, // Waktu tunggu minimal: 5 menit
  maxWait: 60 * 60 * 1000, // Waktu tunggu maksimal: 1 jam
  lifetime: 24 * 60 * 60, // Reset percobaan setelah 24 jam
});

// Konfigurasi rate limit untuk semua permintaan
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimum 100 permintaan per IP
  message: "Terlalu banyak permintaan dari IP ini, coba lagi nanti.",
});

// Rate limit khusus untuk endpoint login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 15, // Maksimum 10 permintaan login per IP
  message: "Terlalu banyak percobaan login. Coba lagi nanti.",
});

// Rute untuk register
router.post(
  "/register",
  [
    limiter, // Tambahkan rate limiter untuk keamanan
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
    loginLimiter, // Rate limiter khusus login
    bruteforce.prevent, // Mekanisme anti brute force
    check("email", "Masukkan email yang valid").isEmail(),
    check("password", "Kata sandi diperlukan").exists(),
  ],
  authController.login
);

// Rute untuk mendapatkan informasi pengguna
router.get(
  "/user",
  limiter, // Rate limiter untuk akses endpoint user
  authMiddleware, // Middleware autentikasi
  authController.getUser
);

module.exports = router;
