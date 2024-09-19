// routes/authRoutes.js
const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Perbaiki impor middleware
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk autentikasi pengguna
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with the provided details.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username for the new user.
 *                 example: 'john_doe'
 *               email:
 *                 type: string
 *                 description: Email address for the new user.
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 description: Password for the new user.
 *                 example: 'password123'
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request, validation errors.
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login user
 *     description: Authenticate a user with their email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address for the user.
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 description: Password for the user.
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Successfully authenticated and returned a token.
 *       400:
 *         description: Bad request, validation errors.
 *       401:
 *         description: Unauthorized, invalid credentials.
 */
router.post(
  "/login",
  [
    check("email", "Masukkan email yang valid").isEmail(),
    check("password", "Kata sandi diperlukan").exists(),
  ],
  authController.login
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get user information
 *     description: Retrieve the information of the currently authenticated user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   description: Username of the user.
 *                   example: 'john_doe'
 *                 email:
 *                   type: string
 *                   description: Email address of the user.
 *                   example: 'john.doe@example.com'
 *       401:
 *         description: Unauthorized, user must be authenticated.
 */
router.get("/user", authMiddleware, authController.getUser);

module.exports = router;
