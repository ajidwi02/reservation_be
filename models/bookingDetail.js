const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const BookingRoom = require("./bookingRoom");
const Room = require("./room");

class BookingDetail extends Model {}

BookingDetail.init(
  {
    booking_detail_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    booking_room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BookingRoom, // Objek model
        key: "booking_room_id",
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Room, // Objek model
        key: "room_id",
      },
    },
    nomor_pesanan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "BookingDetail",
    tableName: "booking_detail",
    timestamps: false,
  }
);

BookingDetail.belongsTo(BookingRoom, { foreignKey: "booking_room_id" });
BookingRoom.hasMany(BookingDetail, { foreignKey: "booking_room_id" });

BookingDetail.belongsTo(Room, { foreignKey: "room_id" });
Room.hasMany(BookingDetail, { foreignKey: "room_id" });
module.exports = BookingDetail;
