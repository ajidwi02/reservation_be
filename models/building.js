const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Building = sequelize.define('Building', {
  building_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'building',
  timestamps: false
});

// models/building.js
Building.getAllWithRoomStatus = async () => {
  const query = `
    SELECT 
      b.building_id,
      b.name AS building_name,
      rs.status_name AS room_status,
      rt.type_name AS room_type,
      COUNT(r.room_id) AS room_count,
      GROUP_CONCAT(r.room_number) AS room_numbers
    FROM 
      building b
    LEFT JOIN 
      room r ON b.building_id = r.building_id
    LEFT JOIN 
      room_status rs ON r.status_id = rs.status_id
    LEFT JOIN 
      room_type rt ON r.room_type_id = rt.room_type_id
    GROUP BY 
      b.building_id, rs.status_name, rt.type_name;
  `;
  
  try {
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    throw error;
  }
};



module.exports = Building;
