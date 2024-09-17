const express = require("express");
const router = express.Router();
const roomTypeController = require("../controllers/roomTypeController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

// Mendapatkan semua room types (tidak memerlukan autentikasi)
router.get("/room-types", roomTypeController.getAllRoomTypes);

// Mendapatkan room type berdasarkan ID (tidak memerlukan autentikasi)
router.get("/room-types/:id", roomTypeController.getRoomTypeById);

// Menambahkan room type baru (memerlukan autentikasi dan admin)
router.post("/room-types", authMiddleware, adminMiddleware, roomTypeController.createRoomType);

// Memperbarui room type berdasarkan ID (memerlukan autentikasi dan admin)
router.put("/room-types/:id", authMiddleware, adminMiddleware, roomTypeController.updateRoomType);

// Menghapus room type berdasarkan ID (memerlukan autentikasi dan admin)
router.delete("/room-types/:id", authMiddleware, adminMiddleware, roomTypeController.deleteRoomType);

module.exports = router;
