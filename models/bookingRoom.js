const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Booking = require("./booking");

class BookingRoom extends Model {}

BookingRoom.init(
  {
    booking_room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Booking,
        key: "booking_id",
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BookingRoom",
    tableName: "booking_room",
    timestamps: false,
  }
);

// Asosiasi
BookingRoom.belongsTo(Booking, {
  foreignKey: "booking_id",
  onDelete: "CASCADE",
});
Booking.hasMany(BookingRoom, { foreignKey: "booking_id" });

// Hapus asosiasi terkait Room karena room_id berada di tabel BookingDetail
// BookingRoom.belongsTo(Room, { foreignKey: "room_id" });
// Room.hasMany(BookingRoom, { foreignKey: "room_id" });

// Pastikan untuk mengekspor model
module.exports = BookingRoom;
