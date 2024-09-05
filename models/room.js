// Mengimpor konfigurasi database dari file '../config/db'
const db = require("../config/db");

// Mendefinisikan objek Room dengan berbagai metode untuk mengelola data ruangan
const Room = {
  // Mengambil semua ruangan
  getAll: (callback) => {
    // Query SQL untuk memilih semua kolom dari tabel room
    // serta nama building dari tabel building dan nama status dari tabel room_status
    // dengan menggunakan JOIN untuk menggabungkan tabel-tabel tersebut
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
    // Menjalankan query dan memanggil callback dengan hasilnya
    db.query(query, callback);
  },

  // Mengambil ruangan berdasarkan ID
  getById: (id, callback) => {
    // Query SQL untuk memilih kolom yang sama seperti di atas
    // namun hanya untuk ruangan dengan room_id yang sesuai dengan parameter id
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
      WHERE 
        room.room_id = ?
    `;
    // Menjalankan query dengan parameter id dan memanggil callback dengan hasilnya
    db.query(query, [id], callback);
  },

  // Menambahkan ruangan baru
  create: (room, callback) => {
    // Query SQL untuk menyisipkan data baru ke dalam tabel room
    // dengan nilai building_id, room_number, room_type_id, dan status_id
    const query = `
      INSERT INTO room (building_id, room_number, room_type_id, status_id)
      VALUES (?, ?, ?, ?)
    `;
    // Menjalankan query dengan parameter yang sesuai dari objek room
    // dan memanggil callback dengan hasilnya
    db.query(
      query,
      [room.building_id, room.room_number, room.room_type_id, room.status_id],
      callback
    );
  },

  // Memperbarui ruangan berdasarkan ID
  update: (id, room, callback) => {
    // Query SQL untuk memperbarui data di tabel room
    // berdasarkan room_id yang diberikan
    const query = `
      UPDATE room
      SET building_id = ?, 
          room_number = ?, 
          room_type_id = ?, 
          status_id = ?
      WHERE room_id = ?
    `;
    // Menjalankan query dengan parameter yang sesuai dari objek room
    // serta id untuk mengidentifikasi ruangan yang akan diperbarui
    // dan memanggil callback dengan hasilnya
    db.query(
      query,
      [
        room.building_id,
        room.room_number,
        room.room_type_id,
        room.status_id,
        id,
      ],
      callback
    );
  },

  // Menghapus ruangan berdasarkan ID
  delete: (id, callback) => {
    // Query SQL untuk menghapus entry dari tabel room
    // berdasarkan room_id yang diberikan
    const query = `
      DELETE FROM room
      WHERE room_id = ?
    `;
    // Menjalankan query dengan parameter id
    // dan memanggil callback dengan hasilnya
    db.query(query, [id], callback);
  },
};

// Mengekspor objek Room agar dapat digunakan di modul lain
module.exports = Room;
