const express = require("express");
const router = express.Router();
const roomStatusController = require("../controllers/roomStatusController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

// Mendapatkan semua room statuses (tidak memerlukan autentikasi)
router.get("/room-statuses", roomStatusController.getAllRoomStatuses);

// Mendapatkan room status berdasarkan ID (tidak memerlukan autentikasi)
router.get("/room-statuses/:id", roomStatusController.getRoomStatusById);

// Menambahkan room status baru (memerlukan autentikasi dan admin)
router.post("/room-statuses", authMiddleware, adminMiddleware, roomStatusController.createRoomStatus);

// Memperbarui room status berdasarkan ID (memerlukan autentikasi dan admin)
router.put("/room-statuses/:id", authMiddleware, adminMiddleware, roomStatusController.updateRoomStatus);

// Menghapus room status berdasarkan ID (memerlukan autentikasi dan admin)
router.delete("/room-statuses/:id", authMiddleware, adminMiddleware, roomStatusController.deleteRoomStatus);

module.exports = router;
