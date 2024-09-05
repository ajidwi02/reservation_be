const express = require("express");
const router = express.Router();
const roomTypeController = require("../controllers/roomTypeController");

router.get("/room-types", roomTypeController.getAllRoomTypes);
router.get("/room-types/:id", roomTypeController.getRoomTypeById);
router.post("/room-types", roomTypeController.createRoomType);
router.put("/room-types/:id", roomTypeController.updateRoomType);
router.delete("/room-types/:id", roomTypeController.deleteRoomType);

module.exports = router;
