const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import Sequelize instance

// Mendefinisikan model RoomStatus dengan Sequelize
const RoomStatus = sequelize.define('RoomStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  status_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'room_status',
  timestamps: false // Jika tidak menggunakan kolom createdAt dan updatedAt
});

module.exports = RoomStatus;
