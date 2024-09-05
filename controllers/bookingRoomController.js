// Mengimpor model BookingRoom dari file '../models/bookingRoom'
const BookingRoom = require("../models/bookingRoom");

// Mendapatkan semua booking rooms
exports.getAllBookingRooms = (req, res) => {
  // Memanggil metode getAll dari model BookingRoom
  BookingRoom.getAll((err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil booking rooms",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Booking rooms berhasil diambil",
      data: results,
    });
  });
};

// Membuat booking room baru
exports.createBookingRoom = (req, res) => {
  // Mendapatkan data booking room dari body request
  const bookingRoom = req.body;

  // Memanggil metode create dari model BookingRoom
  BookingRoom.create(bookingRoom, (err) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal membuat booking room",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 201
    res.status(201).json({
      status: "success",
      message: "Booking room berhasil dibuat",
    });
  });
};

// Memperbarui booking room
exports.updateBookingRoom = (req, res) => {
  // Mendapatkan bookingRoomId dari parameter URL dan data booking room dari body request
  const bookingRoomId = req.params.id;
  const bookingRoom = req.body;

  // Memanggil metode update dari model BookingRoom
  BookingRoom.update(bookingRoomId, bookingRoom, (err) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal memperbarui booking room",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil diperbarui",
    });
  });
};

// Menghapus booking room
exports.deleteBookingRoom = (req, res) => {
  // Mendapatkan bookingRoomId dari parameter URL
  const bookingRoomId = req.params.id;

  // Memanggil metode delete dari model BookingRoom
  BookingRoom.delete(bookingRoomId, (err) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus booking room",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil dihapus",
    });
  });
};
