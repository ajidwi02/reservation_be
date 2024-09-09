// models/booking.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Booking extends Model {}

Booking.init({
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  booking_date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'booking',
  timestamps: false
});

module.exports = Booking;
