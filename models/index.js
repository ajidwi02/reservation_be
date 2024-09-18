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
Room.belongsTo(RoomType, { foreignKey: "room_type_id" }); // Pastikan asosiasi ini ada
Building.hasMany(Room, { foreignKey: "building_id" });
RoomType.hasMany(Room, { foreignKey: "room_type_id" });
Room.hasMany(BookingRoom, { foreignKey: "room_id" });
Booking.hasMany(BookingRoom, { foreignKey: "booking_id" });

module.exports = {
  BookingRoom,
  Booking,
  Room,
  Building,
  RoomStatus,
  RoomType,
};
