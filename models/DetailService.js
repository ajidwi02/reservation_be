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
    validate: {
      isInt: true,
      min: 0, // Pastikan harga tidak negatif
    },
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    validate: {
      min: 0,
      max: 5, // Misalkan rating dibatasi antara 0 dan 5
    },
  },
  foto: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  jumlah_kamar: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'detail_service',
  timestamps: false, // Menambahkan timestamps
});

module.exports = DetailService;
