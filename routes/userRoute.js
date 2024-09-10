const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Mendapatkan semua pengguna
router.get("/users", userController.getAllUsers);

// Mendapatkan pengguna berdasarkan ID
router.get("/users/:id", userController.getUserById);

// Memperbarui pengguna
router.put("/users/:id", userController.updateUser);

// Menghapus pengguna
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
