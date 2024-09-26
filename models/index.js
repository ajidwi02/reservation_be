const HistoryBookingRoom = require("./historyBR");
const BookingRoom = require("./bookingRoom");
const Booking = require("./booking");
const Room = require("./room");
const Building = require("./building");
const RoomStatus = require("./roomStatus");
const RoomType = require("./roomType");

// Asosiasi antar model
BookingRoom.belongsTo(Booking, { foreignKey: "booking_id" });
BookingRoom.belongsTo(Room, { foreignKey: "room_id" });
Room.belongsTo(Building, { foreignKey: "building_id" });
Room.belongsTo(RoomType, { foreignKey: "room_type_id" });
Building.hasMany(Room, { foreignKey: "building_id" });
RoomType.hasMany(Room, { foreignKey: "room_type_id" });
Room.hasMany(BookingRoom, { foreignKey: "room_id" });
Booking.hasMany(BookingRoom, { foreignKey: "booking_id" });

// Tambahkan asosiasi untuk HistoryBookingRoom
HistoryBookingRoom.belongsTo(Room, { foreignKey: 'room_id' });

module.exports = {
  HistoryBookingRoom,  // Pastikan HistoryBookingRoom ditambahkan di sini
  BookingRoom,
  Booking,
  Room,
  Building,
  RoomStatus,
  RoomType,
};
