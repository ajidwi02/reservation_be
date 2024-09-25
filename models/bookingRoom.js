const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Booking = require('./booking');
const Room = require('./room');
const Building = require('./building');

class BookingRoom extends Model {}

BookingRoom.init({
  booking_room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Booking,
      key: 'booking_id',
    },
    allowNull: false,
    
  },
  room_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Room,
      key: 'room_id',
    },
    allowNull: false,
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'BookingRoom',
  tableName: 'booking_room',
  timestamps: false,
});

// Asosiasi
BookingRoom.belongsTo(Booking, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
BookingRoom.belongsTo(Room, { foreignKey: 'room_id' });
Room.belongsTo(Building, { foreignKey: 'building_id' }); 
Booking.hasMany(BookingRoom, { foreignKey: 'booking_id' });
Room.hasMany(BookingRoom, { foreignKey: 'room_id' });

// Tambahkan asosiasi Building - Room jika perlu
Building.hasMany(Room, { foreignKey: 'building_id' });
// Pastikan untuk mengekspor model tanpa memanggil constructor
module.exports = BookingRoom;
