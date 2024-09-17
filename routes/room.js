const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

// Route untuk mendapatkan semua ruangan berdasarkan building_id
router.get('/rooms/buildings/:id', roomController.getAllRoomsByBuildingId);

// Mendapatkan ruangan berdasarkan ID
router.get("/rooms/:id", roomController.getRoomById);

// Menambahkan ruangan baru (memerlukan autentikasi dan admin)
router.post("/rooms", authMiddleware, adminMiddleware, roomController.createRoom);

// Memperbarui ruangan berdasarkan ID (memerlukan autentikasi dan admin)
router.put("/rooms/:id", authMiddleware, adminMiddleware, roomController.updateRoom);

// Menghapus ruangan berdasarkan ID (memerlukan autentikasi dan admin)
router.delete("/rooms/:id", authMiddleware, adminMiddleware, roomController.deleteRoom);


module.exports = router;
