const Booking = require('../models/booking');

// Mendapatkan semua booking
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
    res.status(200).json({
      status: "success",
      message: "Data booking berhasil diambil",
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan data booking",
      error: error.message
    });
  }
};

// Mendapatkan satu booking berdasarkan ID
exports.getBookingById = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Data booking berhasil diambil",
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan data booking",
      error: error.message
    });
  }
};

// Membuat booking baru
exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(); // Buat entri dengan booking_date default
    res.status(201).json({
      status: 'success',
      message: 'Booking berhasil dibuat',
      data: booking,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat booking',
      error: err.message,
    });
  }
};

// Memperbarui booking
exports.updateBooking = async (req, res) => {
  const bookingId = req.params.id;
  const { booking_date } = req.body;
  try {
    const [updated] = await Booking.update({ booking_date }, {
      where: { booking_id: bookingId }
    });
    if (updated === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking berhasil diperbarui"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui booking",
      error: error.message
    });
  }
};

// Menghapus booking
exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const deleted = await Booking.destroy({
      where: { booking_id: bookingId }
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus booking",
      error: error.message
    });
  }
};
