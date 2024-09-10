const express = require("express");
const router = express.Router();
const bookingRoomController = require("../controllers/bookingRoomController");

// Mendapatkan semua booking rooms
router.get("/booking-rooms", bookingRoomController.getAllBookingRooms);

// Mendapatkan booking room berdasarkan ID
router.get("/booking-rooms/:id", bookingRoomController.getBookingRoomById);

// Membuat booking room baru
router.post("/booking-rooms", bookingRoomController.createBookingRoom);

// Memperbarui booking room
router.put("/booking-rooms/:id", bookingRoomController.updateBookingRoom);

// Menghapus booking room
router.delete("/booking-rooms/:id", bookingRoomController.deleteBookingRoom);

module.exports = router;
