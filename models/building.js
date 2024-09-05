// Mengimpor konfigurasi database dari file '../config/db'
const db = require("../config/db");

// Mendefinisikan objek Building dengan berbagai metode untuk mengelola data building
const Building = {
  // Mendapatkan semua data building
  getAll: (callback) => {
    // Query SQL untuk memilih semua building_id dan nama dari tabel building
    const query = `
      SELECT 
        building_id, 
        name 
      FROM 
        building
    `;
    // Menjalankan query dan memanggil callback dengan hasilnya
    db.query(query, callback);
  },

  // Mendapatkan data building berdasarkan ID
  getById: (buildingId, callback) => {
    // Query SQL untuk memilih building_id dan nama dari tabel building
    // berdasarkan ID yang diberikan
    const query = `
      SELECT 
        building_id, 
        name 
      FROM 
        building 
      WHERE 
        building_id = ?
    `;
    // Menjalankan query dengan parameter buildingId dan memanggil callback dengan hasilnya
    db.query(query, [buildingId], callback);
  },

  // Menambahkan building baru
  create: (name, callback) => {
    // Query SQL untuk menyisipkan nama building baru ke dalam tabel building
    const query = `
      INSERT INTO building (name) 
      VALUES (?)
    `;
    // Menjalankan query dengan parameter nama building dan memanggil callback dengan hasilnya
    db.query(query, [name], callback);
  },

  // Memperbarui data building berdasarkan ID
  update: (buildingId, name, callback) => {
    // Query SQL untuk memperbarui nama building di tabel building
    // berdasarkan building_id yang diberikan
    const query = `
      UPDATE building 
      SET name = ? 
      WHERE building_id = ?
    `;
    // Menjalankan query dengan parameter nama building dan buildingId, lalu memanggil callback dengan hasilnya
    db.query(query, [name, buildingId], callback);
  },

  // Menghapus data building berdasarkan ID
  delete: (buildingId, callback) => {
    // Query SQL untuk menghapus building dari tabel building
    // berdasarkan building_id yang diberikan
    const query = `
      DELETE FROM building 
      WHERE building_id = ?
    `;
    // Menjalankan query dengan parameter buildingId dan memanggil callback dengan hasilnya
    db.query(query, [buildingId], callback);
  },
};

// Mengekspor objek Building agar dapat digunakan di modul lain
module.exports = Building;
