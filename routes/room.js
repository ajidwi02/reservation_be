const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// Route untuk mendapatkan semua ruangan berdasarkan building_id
router.get('/rooms/buildings/:id', roomController.getAllRoomsByBuildingId);

// Mendapatkan ruangan berdasarkan ID
router.get("/rooms/:id", roomController.getRoomById);

// Menambahkan ruangan baru
router.post("/rooms", roomController.createRoom);

// Memperbarui ruangan berdasarkan ID
router.put("/rooms/:id", roomController.updateRoom);

// Menghapus ruangan berdasarkan ID
router.delete("/rooms/:id", roomController.deleteRoom);

module.exports = router;
