// models/bookingRoom.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Booking = require('./booking');
const Room = require('./room');

class BookingRoom extends Model {}

BookingRoom.init({
  booking_room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Booking,
      key: 'booking_id'
    }
  },
  room_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'room_id'
    }
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'BookingRoom',
  tableName: 'booking_room',
  timestamps: false
});

// Asosiasi
BookingRoom.belongsTo(Booking, { foreignKey: 'booking_id' });
BookingRoom.belongsTo(Room, { foreignKey: 'room_id' });
Booking.hasMany(BookingRoom, { foreignKey: 'booking_id' });
Room.hasMany(BookingRoom, { foreignKey: 'room_id' });

module.exports = BookingRoom;
