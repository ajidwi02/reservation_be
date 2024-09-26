const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class HistoryBookingRoom extends Model {}

HistoryBookingRoom.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  booking_room_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Ubah menjadi true agar dapat menyimpan NULL
    references: {
      model: 'BookingRoom', // Model yang sesuai
      key: 'booking_room_id',
    },
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Room', // Model yang sesuai
      key: 'room_id',
    },
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  changed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'HistoryBookingRoom',
  tableName: 'history_booking_rooms',
  timestamps: false,
});

module.exports = HistoryBookingRoom;
