const express = require("express");
const router = express.Router();
const { BookingRoom, Room, Building, RoomStatus, RoomType, Booking } = require("../models");
const { Sequelize } = require('sequelize');

// GET /api/history
router.get("/history", async (req, res) => {
  try {
    const history = await BookingRoom.findAll({
      include: [
        {
          model: Room,
          include: [
            { model: Building, attributes: ["name"] },
            { model: RoomStatus, attributes: ["status_name"] },
            { model: RoomType, attributes: ["type_name"] }, // Include RoomType
          ],
        },
        {
          model: Booking,
          attributes: [
            "booking_date",
            [Sequelize.literal("DAYNAME(booking_date)"), "day_name"],
          ],
        },
      ],
    });

    // Format data sesuai dengan yang diinginkan
    const formattedHistory = history.map(record => ({
      booking_room_id: record.booking_room_id,
      booking_id: record.booking_id,
      room_id: record.room_id,
      days: record.days,
      detail: {
        room_number: record.Room.room_number,
        type_name: record.Room.RoomType.type_name, // Ambil type_name dari RoomType
        Booking: {
          booking_date: record.Booking.booking_date,
          day_name: record.Booking.day_name,
        },
        Building: record.Room.Building,
      },
    }));

    // Respons dengan status dan message
    res.json({
      status: "success",
      message: "Booking history fetched successfully",
      data: formattedHistory,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    res.status(500).json({
      status: "error",
      message: "Error fetching booking history",
      data: null,
    });
  }
});

// Asosiasi Room dengan Building, RoomStatus, dan RoomType
Room.belongsTo(Building, { foreignKey: 'building_id' });
Room.belongsTo(RoomStatus, { foreignKey: 'status_id' });
Room.belongsTo(RoomType, { foreignKey: 'room_type_id' }); // Asosiasi Room dengan RoomType
// Asosiasi BookingRoom dengan Booking
BookingRoom.belongsTo(Booking, { foreignKey: 'booking_id' });

module.exports = router;
