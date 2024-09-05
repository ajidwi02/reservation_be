const express = require("express");
const router = express.Router();
const roomStatusController = require("../controllers/roomStatusController");

router.get("/room-statuses", roomStatusController.getAllRoomStatuses);
router.get("/room-statuses/:id", roomStatusController.getRoomStatusById);
router.post("/room-statuses", roomStatusController.createRoomStatus);
router.put("/room-statuses/:id", roomStatusController.updateRoomStatus);
router.delete("/room-statuses/:id", roomStatusController.deleteRoomStatus);

module.exports = router;
