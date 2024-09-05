// Mengimpor konfigurasi database dari file '../config/db'
const db = require("../config/db");

// Mendefinisikan objek RoomStatus dengan berbagai metode untuk mengelola data status ruangan
const RoomStatus = {
  // Mengambil semua status ruangan
  getAll: (callback) => {
    // Query SQL untuk memilih semua kolom dari tabel room_status
    const query = `
      SELECT 
        status_id, 
        status_name 
      FROM 
        room_status
    `;
    // Menjalankan query dan memanggil callback dengan hasilnya
    db.query(query, callback);
  },

  // Mengambil status ruangan berdasarkan ID
  getById: (statusId, callback) => {
    // Query SQL untuk memilih kolom status_id dan status_name
    // dari tabel room_status berdasarkan status_id yang diberikan
    const query = `
      SELECT 
        status_id, 
        status_name 
      FROM 
        room_status 
      WHERE status_id = ?
    `;
    // Menjalankan query dengan parameter statusId dan memanggil callback dengan hasilnya
    db.query(query, [statusId], callback);
  },

  // Menambahkan status ruangan baru
  create: (statusName, callback) => {
    // Query SQL untuk menyisipkan data baru ke dalam tabel room_status
    // dengan nilai status_name
    const query = `
      INSERT INTO room_status (status_name) 
      VALUES (?)
    `;
    // Menjalankan query dengan parameter statusName dan memanggil callback dengan hasilnya
    db.query(query, [statusName], callback);
  },

  // Memperbarui status ruangan berdasarkan ID
  update: (statusId, statusName, callback) => {
    // Query SQL untuk memperbarui data di tabel room_status
    // berdasarkan status_id yang diberikan
    const query = `
      UPDATE room_status 
      SET status_name = ? 
      WHERE status_id = ?
    `;
    // Menjalankan query dengan parameter statusName untuk diperbarui
    // dan statusId untuk mengidentifikasi entry yang akan diperbarui
    db.query(query, [statusName, statusId], callback);
  },

  // Menghapus status ruangan berdasarkan ID
  delete: (statusId, callback) => {
    // Query SQL untuk menghapus entry dari tabel room_status
    // berdasarkan status_id yang diberikan
    const query = `
      DELETE FROM room_status 
      WHERE status_id = ?
    `;
    // Menjalankan query dengan parameter statusId
    // dan memanggil callback dengan hasilnya
    db.query(query, [statusId], callback);
  },
};

// Mengekspor objek RoomStatus agar dapat digunakan di modul lain
module.exports = RoomStatus;
