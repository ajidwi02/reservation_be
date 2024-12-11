const express = require("express");
const router = express.Router();
const bookingDetailController = require("../controllers/bookingDetailController");

router.post("/booking-details", bookingDetailController.createBookingDetail);
router.get("/booking-details", bookingDetailController.getAllBookingDetails);
router.get("/booking-details/:booking_room_id", bookingDetailController.getBookingDetailsByBRoomId);
router.get(
  "/booking-details/:id",
  bookingDetailController.getBookingDetailById
);
router.delete(
  "/booking-details/:id",
  bookingDetailController.deleteBookingDetail
);

module.exports = router;
