const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const RoomStatus = require("./roomStatus");
const Building = require("./building");

class Room extends Model {}

Room.init(
  {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    room_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    building_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "buildings", // Menggunakan plural untuk konsistensi
        key: "building_id",
      },
    },
    room_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "room_types", // Menggunakan plural untuk konsistensi
        key: "room_type_id",
      },
    },
    status_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "room_statuses", // Menggunakan plural untuk konsistensi
        key: "status_id",
      },
    },
    harga: {
      type: DataTypes.INTEGER, // Kolom baru untuk harga
      allowNull: true, // Bisa diatur sesuai kebutuhan, misalnya `false` jika harga wajib
    },
  },
  {
    sequelize,
    modelName: "Room",
    tableName: "room",
    timestamps: false,
  }
);

// Relasi dengan tabel Building
Room.belongsTo(Building, { foreignKey: "building_id" });
Building.hasMany(Room, { foreignKey: "building_id" });

// Relasi dengan tabel RoomStatus
Room.belongsTo(RoomStatus, { foreignKey: "status_id" });
RoomStatus.hasMany(Room, { foreignKey: "status_id" });

// Fungsi untuk mendapatkan semua ruangan berdasarkan building_id
Room.getAllByBuildingId = async (building_id) => {
  try {
    const rooms = await Room.findAll({
      where: { building_id },
      include: [
        {
          model: Building,
          attributes: ["name"], // hanya ambil kolom yang diperlukan
        },
        {
          model: RoomStatus,
          attributes: ["status_name"],
        },
      ],
    });
    return rooms;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Fungsi untuk query custom berdasarkan building_id
Room.getAllByBuildingId = async (building_id) => {
  const query = `
    SELECT 
      room.room_id, 
      room.room_number, 
      building.name AS building_name, 
      room_status.status_name,
      room.room_type_id,
      room.harga 
    FROM 
      room
    JOIN 
      building ON room.building_id = building.building_id
    JOIN 
      room_status ON room.status_id = room_status.status_id
    WHERE 
      room.building_id = :building_id
  `;

  try {
    const [results] = await sequelize.query(query, {
      replacements: { building_id },
    });
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
      room_status.status_name,
      room.harga 
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
      replacements: [id],
    });
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = Room;
