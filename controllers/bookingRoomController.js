const BookingRoom = require('../models/bookingRoom');
const Booking = require('../models/booking');
const Room = require('../models/room');

// Mendapatkan semua booking rooms
exports.getAllBookingRooms = async (req, res) => {
  try {
    const bookingRooms = await BookingRoom.findAll({
      include: [
        { model: Booking, attributes: ['booking_date'] },
        { model: Room, attributes: ['room_number'] }
      ]
    });
    res.status(200).json({
      status: "success",
      message: "Booking rooms berhasil diambil",
      data: bookingRooms
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking rooms",
      error: error.message
    });
  }
};

// Membuat booking room baru
exports.createBookingRoom = async (req, res) => {
  try {
    const { room_id, days } = req.body;

    // Pastikan booking_id diisi dari parameter atau entri booking yang ada
    const booking = await Booking.create(); // Buat booking baru jika belum ada
    const booking_id = booking.booking_id;

    const bookingRoom = await BookingRoom.create({
      booking_id,
      room_id,
      days,
    });

    res.status(201).json({
      status: 'success',
      message: 'Booking room berhasil dibuat',
      data: bookingRoom,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat booking room',
      error: err.message,
    });
  }
};

// Memperbarui booking room
exports.updateBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;
  const { booking_id, room_id, days } = req.body;
  try {
    const [updated] = await BookingRoom.update(
      { booking_id, room_id, days },
      { where: { booking_room_id: bookingRoomId } }
    );
    if (updated === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil diperbarui"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui booking room",
      error: error.message
    });
  }
};

// Menghapus booking room
exports.deleteBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;
  try {
    const deleted = await BookingRoom.destroy({
      where: { booking_room_id: bookingRoomId }
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus booking room",
      error: error.message
    });
  }
};
