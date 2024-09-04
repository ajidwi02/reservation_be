const express = require("express");
const router = express.Router();
const roomController = require("../controllers/RoomController");

router.get("/rooms", roomController.getAllRooms);

module.exports = router;
