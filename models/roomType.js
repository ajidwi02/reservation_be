// Mengimpor konfigurasi database dari file '../config/db'
const db = require("../config/db");

// Mendefinisikan objek RoomType dengan berbagai metode untuk mengelola data tipe ruangan
const RoomType = {
  // Mengambil semua tipe ruangan
  getAll: (callback) => {
    // Query SQL untuk memilih semua kolom dari tabel room_type
    const query = `
      SELECT 
        room_type_id, 
        type_name 
      FROM 
        room_type
    `;
    // Menjalankan query dan memanggil callback dengan hasilnya
    db.query(query, callback);
  },

  // Mengambil tipe ruangan berdasarkan ID
  getById: (roomTypeId, callback) => {
    // Query SQL untuk memilih kolom room_type_id dan type_name
    // dari tabel room_type berdasarkan room_type_id yang diberikan
    const query = `
      SELECT 
        room_type_id, 
        type_name 
      FROM 
        room_type 
      WHERE room_type_id = ?
    `;
    // Menjalankan query dengan parameter roomTypeId dan memanggil callback dengan hasilnya
    db.query(query, [roomTypeId], callback);
  },

  // Menambahkan tipe ruangan baru
  create: (typeName, callback) => {
    // Query SQL untuk menyisipkan data baru ke dalam tabel room_type
    // dengan nilai type_name
    const query = `
      INSERT INTO room_type (type_name) 
      VALUES (?)
    `;
    // Menjalankan query dengan parameter typeName dan memanggil callback dengan hasilnya
    db.query(query, [typeName], callback);
  },

  // Memperbarui tipe ruangan berdasarkan ID
  update: (roomTypeId, typeName, callback) => {
    // Query SQL untuk memperbarui data di tabel room_type
    // berdasarkan room_type_id yang diberikan
    const query = `
      UPDATE room_type 
      SET type_name = ? 
      WHERE room_type_id = ?
    `;
    // Menjalankan query dengan parameter typeName untuk diperbarui
    // dan roomTypeId untuk mengidentifikasi entry yang akan diperbarui
    db.query(query, [typeName, roomTypeId], callback);
  },

  // Menghapus tipe ruangan berdasarkan ID
  delete: (roomTypeId, callback) => {
    // Query SQL untuk menghapus entry dari tabel room_type
    // berdasarkan room_type_id yang diberikan
    const query = `
      DELETE FROM room_type 
      WHERE room_type_id = ?
    `;
    // Menjalankan query dengan parameter roomTypeId
    // dan memanggil callback dengan hasilnya
    db.query(query, [roomTypeId], callback);
  },
};

// Mengekspor objek RoomType agar dapat digunakan di modul lain
module.exports = RoomType;
