// Mengimpor konfigurasi database dari file '../config/db'
const db = require("../config/db");

// Mendefinisikan objek BookingRoom dengan berbagai metode untuk mengelola data booking room
const BookingRoom = {
  // Mendapatkan semua booking rooms
  getAll: (callback) => {
    // Query SQL untuk memilih semua kolom dari booking_room
    // serta kolom booking_date dari tabel booking dan room_number dari tabel room
    // dengan menggunakan JOIN untuk menggabungkan tabel-tabel tersebut
    const query = `
      SELECT booking_room.*, booking.booking_date, room.room_number
      FROM booking_room
      JOIN booking ON booking_room.booking_id = booking.booking_id
      JOIN room ON booking_room.room_id = room.room_id
    `;
    // Menjalankan query dan memanggil callback dengan hasilnya
    db.query(query, callback);
  },

  // Menambahkan booking room baru
  create: (bookingRoom, callback) => {
    // Query SQL untuk menyisipkan data baru ke dalam tabel booking_room
    const query = `
      INSERT INTO booking_room (booking_id, room_id, days)
      VALUES (?, ?, ?)
    `;
    // Menjalankan query dengan parameter booking_id, room_id, dan days
    // dan memanggil callback dengan hasilnya
    db.query(
      query,
      [bookingRoom.booking_id, bookingRoom.room_id, bookingRoom.days],
      callback
    );
  },

  // Memperbarui booking room
  update: (id, bookingRoom, callback) => {
    // Query SQL untuk memperbarui data di tabel booking_room
    // berdasarkan booking_room_id yang diberikan
    const query = `
      UPDATE booking_room
      SET booking_id = ?, room_id = ?, days = ?
      WHERE booking_room_id = ?
    `;
    // Menjalankan query dengan parameter booking_id, room_id, days, dan id (booking_room_id)
    // dan memanggil callback dengan hasilnya
    db.query(
      query,
      [bookingRoom.booking_id, bookingRoom.room_id, bookingRoom.days, id],
      callback
    );
  },

  // Menghapus booking room
  delete: (id, callback) => {
    // Query SQL untuk menghapus entry dari tabel booking_room
    // berdasarkan booking_room_id yang diberikan
    const query = `
      DELETE FROM booking_room WHERE booking_room_id = ?
    `;
    // Menjalankan query dengan parameter id (booking_room_id)
    // dan memanggil callback dengan hasilnya
    db.query(query, [id], callback);
  },
};

// Mengekspor objek BookingRoom agar dapat digunakan di modul lain
module.exports = BookingRoom;
