const express = require("express");
const router = express.Router();
const bookingRoomController = require("../controllers/bookingRoomController");

// Mendapatkan semua booking rooms
router.get("/booking-rooms", bookingRoomController.getAllBookingRooms);

// Membuat booking room baru
router.post("/booking-rooms", bookingRoomController.createBookingRoom);

// Memperbarui booking room
router.put("/booking-rooms/:id", bookingRoomController.updateBookingRoom);

// Menghapus booking room
router.delete("/booking-rooms/:id", bookingRoomController.deleteBookingRoom);

module.exports = router;
