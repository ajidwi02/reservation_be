const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // pastikan konfigurasi sequelize sudah ada

const DetailService = sequelize.define('DetailService', {
  detail_service_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  harga: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  jumlah_kamar: {
    type: DataTypes.INTEGER,
    allowNull: true,
  }
}, {
  tableName: 'detail_service',
  timestamps: false,
});

module.exports = DetailService;
