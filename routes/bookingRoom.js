const express = require("express");
const router = express.Router();
const bookingRoomController = require("../controllers/bookingRoomController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware

// Mendapatkan semua booking rooms (tidak memerlukan autentikasi)
router.get("/booking-rooms", bookingRoomController.getAllBookingRooms);

// Mendapatkan booking room berdasarkan ID (tidak memerlukan autentikasi)
router.get("/booking-rooms/:id", bookingRoomController.getBookingRoomById);

// Membuat booking room baru (memerlukan autentikasi)
router.post("/booking-rooms", authMiddleware, bookingRoomController.createBookingRoom);

// Memperbarui booking room (memerlukan autentikasi)
router.put("/booking-rooms/:id", authMiddleware, bookingRoomController.updateBookingRoom);

// Menghapus booking room (memerlukan autentikasi)
router.delete("/booking-rooms/:id", authMiddleware, bookingRoomController.deleteBookingRoom);

module.exports = router;
