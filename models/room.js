const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Sesuaikan path sesuai konfigurasi Anda

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  building_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'buildings', // Menggunakan plural untuk konsistensi
      key: 'building_id'
    }
  },
  room_type_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'room_types', // Menggunakan plural untuk konsistensi
      key: 'room_type_id'
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'room_statuses', // Menggunakan plural untuk konsistensi
      key: 'status_id'
    }
  }
}, {
  tableName: 'room',
  timestamps: false
});

// Fungsi untuk mendapatkan semua ruangan dengan status
Room.getAll = async () => {
  const query = `
    SELECT 
      room.room_id, 
      room.room_number, 
      building.name AS building_name, 
      room_status.status_name
    FROM 
      room
    JOIN 
      building ON room.building_id = building.building_id
    JOIN 
      room_status ON room.status_id = room_status.status_id
  `;

  try {
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};

// Fungsi untuk mendapatkan ruangan berdasarkan ID
Room.getById = async (id) => {
  const query = `
    SELECT 
      room.room_id, 
      room.room_number, 
      building.name AS building_name, 
      room_status.status_name
    FROM 
      room
    JOIN 
      building ON room.building_id = building.building_id
    JOIN 
      room_status ON room.status_id = room_status.status_id
    WHERE 
      room.room_id = ?
  `;

  try {
    const [results] = await sequelize.query(query, {
      replacements: [id]
    });
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = Room;
