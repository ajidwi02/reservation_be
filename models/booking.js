// Mengimpor konfigurasi database dari file '../config/db'
const db = require("../config/db");

// Mendefinisikan objek Booking dengan berbagai metode untuk mengelola data booking
const Booking = {
  // Mendapatkan semua booking
  getAll: (callback) => {
    // Query SQL untuk memilih semua booking_id dan booking_date dari tabel booking
    const query = `
      SELECT booking_id, booking_date 
      FROM booking
    `;
    // Menjalankan query dan memanggil callback dengan hasilnya
    db.query(query, callback);
  },

  // Mendapatkan satu booking berdasarkan ID
  getById: (booking_id, callback) => {
    // Query SQL untuk memilih booking_id dan booking_date dari tabel booking
    // berdasarkan ID yang diberikan
    const query = `
      SELECT booking_id, booking_date 
      FROM booking
      WHERE booking_id = ?
    `;
    // Menjalankan query dengan parameter booking_id
    // Menggunakan callback untuk menangani hasil query
    db.query(query, [booking_id], (err, results) => {
      if (err) {
        // Jika terjadi kesalahan, panggil callback dengan error
        callback(err, null);
      } else {
        // Jika tidak ada kesalahan, panggil callback dengan hasil booking yang ditemukan
        // Mengambil hanya satu booking dari hasil query (results[0])
        callback(null, results[0]);
      }
    });
  },

  // Menambahkan booking baru
  create: (booking, callback) => {
    // Query SQL untuk menyisipkan booking_date ke dalam tabel booking
    const query = `
      INSERT INTO booking (booking_date) 
      VALUES (?)
    `;
    // Menjalankan query dengan parameter booking_date dan memanggil callback dengan hasilnya
    db.query(query, [booking.booking_date], callback);
  },

  // Memperbarui booking berdasarkan ID
  update: (booking_id, booking, callback) => {
    // Query SQL untuk memperbarui booking_date di tabel booking
    // berdasarkan booking_id yang diberikan
    const query = `
      UPDATE booking 
      SET booking_date = ? 
      WHERE booking_id = ?
    `;
    // Menjalankan query dengan parameter booking_date dan booking_id
    // Memanggil callback dengan hasilnya
    db.query(query, [booking.booking_date, booking_id], callback);
  },

  // Menghapus booking berdasarkan ID
  delete: (booking_id, callback) => {
    // Query SQL untuk menghapus booking dari tabel booking
    // berdasarkan booking_id yang diberikan
    const query = `
      DELETE FROM booking 
      WHERE booking_id = ?
    `;
    // Menjalankan query dengan parameter booking_id dan memanggil callback dengan hasilnya
    db.query(query, [booking_id], callback);
  },
};

// Mengekspor objek Booking agar dapat digunakan di modul lain
module.exports = Booking;
