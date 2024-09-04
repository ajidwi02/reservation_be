const db = require("../config/db");

const Room = {
  getAll: (callback) => {
    const query = `
            SELECT 
                room.room_id, 
                room.room_number, 
                building.name, 
                room_status.status_name
            FROM 
                room
            JOIN 
                building ON room.building_id = building.building_id
            JOIN 
                room_status ON room.status_id = room_status.status_id
        `;
    db.query(query, callback);
  },
  // Tambahkan fungsi lain seperti create, update, dan delete jika perlu
};

module.exports = Room;
