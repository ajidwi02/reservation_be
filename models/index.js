const sequelize = require("../config/db");
const Booking = require("./booking");
const BookingDetail = require("./bookingDetail");
const BookingRoom = require("./bookingRoom");
const Room = require("./room");
const Building = require("./building");
const RoomStatus = require("./roomStatus");
const RoomType = require("./roomType");
const HistoryBookingRoom = require("./historyBR");

// Definisikan relasi antar model
Booking.hasMany(BookingRoom, { foreignKey: "booking_id" });
BookingRoom.belongsTo(Booking, { foreignKey: "booking_id" });

BookingRoom.hasMany(BookingDetail, {
  foreignKey: "booking_room_id",
  // as: "bookingDetails",
});
BookingDetail.belongsTo(BookingRoom, {
  foreignKey: "booking_room_id",
  // as: "bookingRoom",
});

// Hubungkan BookingDetail dengan Room melalui RoomId
BookingDetail.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(BookingDetail, { foreignKey: "room_id" });

Room.belongsTo(RoomType, { foreignKey: "room_type_id" });
RoomType.hasMany(Room, { foreignKey: "room_type_id" });

// Hubungkan HistoryBookingRoom dengan Room dan BookingRoom
HistoryBookingRoom.belongsTo(Room, { foreignKey: "room_id" });
HistoryBookingRoom.belongsTo(BookingRoom, {
  foreignKey: "booking_room_id",
});

module.exports = {
  sequelize,
  Booking,
  BookingDetail,
  BookingRoom,
  Room,
  Building,
  RoomStatus,
  RoomType,
  HistoryBookingRoom,
};
