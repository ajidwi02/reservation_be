// Mengimpor model Booking dari file '../models/booking'
const Booking = require("../models/booking");

// Mendapatkan semua booking
exports.getAllBookings = (req, res) => {
  // Memanggil metode getAll dari model Booking
  Booking.getAll((err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal mendapatkan data booking",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Data booking berhasil diambil",
      data: results,
    });
  });
};

// Mendapatkan satu booking berdasarkan ID
exports.getBookingById = (req, res) => {
  // Mendapatkan bookingId dari parameter URL
  const bookingId = req.params.id;

  // Memanggil metode getById dari model Booking
  Booking.getById(bookingId, (err, result) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal mendapatkan data booking",
        error: err.message,
      });
    }

    // Jika booking tidak ditemukan, kirimkan respons error dengan status 404
    if (!result) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan",
      });
    }

    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Data booking berhasil diambil",
      data: result,
    });
  });
};

// Membuat booking baru
exports.createBooking = (req, res) => {
  // Mendapatkan data booking dari body request
  const bookingData = req.body;

  // Memanggil metode create dari model Booking
  Booking.create(bookingData, (err, result) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal membuat booking",
        error: err.message,
      });
    }

    // Jika berhasil, kirimkan respons sukses dengan status 201
    res.status(201).json({
      status: "success",
      message: "Booking berhasil dibuat",
      booking_id: result.insertId, // ID dari booking yang baru dibuat
    });
  });
};

// Memperbarui booking
exports.updateBooking = (req, res) => {
  // Mendapatkan bookingId dari parameter URL dan data booking dari body request
  const bookingId = req.params.id;
  const bookingData = req.body;

  // Memanggil metode update dari model Booking
  Booking.update(bookingId, bookingData, (err, result) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal memperbarui booking",
        error: err.message,
      });
    }

    // Jika tidak ada baris yang terpengaruh (booking tidak ditemukan), kirimkan respons error dengan status 404
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan",
      });
    }

    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Booking berhasil diperbarui",
    });
  });
};

// Menghapus booking
exports.deleteBooking = (req, res) => {
  // Mendapatkan bookingId dari parameter URL
  const bookingId = req.params.id;

  // Memanggil metode delete dari model Booking
  Booking.delete(bookingId, (err, result) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus booking",
        error: err.message,
      });
    }

    // Jika tidak ada baris yang terpengaruh (booking tidak ditemukan), kirimkan respons error dengan status 404
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan",
      });
    }

    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Booking berhasil dihapus",
    });
  });
};
