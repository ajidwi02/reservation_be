const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import instance Sequelize

// Mendefinisikan model RoomType dengan Sequelize
const RoomType = sequelize.define('RoomType', {
  room_type_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type_name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'room_type',
  timestamps: false // Jika tidak menggunakan kolom createdAt dan updatedAt
});

module.exports = RoomType;
