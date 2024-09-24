const BookingRoom = require("../models/bookingRoom");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Building = require("../models/building"); // Tambahkan import Building

// Mendapatkan semua booking rooms
exports.getAllBookingRooms = async (req, res) => {
  try {
    const bookingRooms = await BookingRoom.findAll({
      include: [
        {
          model: Booking,
          attributes: ["booking_date"],
        },
        {
          model: Room,
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"], // Include nama gedung
            },
          ],
        },
      ],
    });
    res.status(200).json({
      status: "success",
      message: "Booking rooms berhasil diambil",
      data: bookingRooms,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking rooms",
      error: error.message,
    });
  }
};

// Mendapatkan booking room berdasarkan ID
exports.getBookingRoomById = async (req, res) => {
  const bookingRoomId = req.params.id;
  try {
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
      include: [
        {
          model: Booking,
          attributes: ["booking_date"],
        },
        {
          model: Room,
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"], // Include nama gedung
            },
          ],
        },
      ],
    });
    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil diambil",
      data: bookingRoom,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking room",
      error: error.message,
    });
  }
};

// Membuat booking room baru
exports.createBookingRoom = async (req, res) => {
  try {
    const { room_id, days, date } = req.body;

    // Validasi tanggal
    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal tidak boleh kosong",
      });
    }

    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal tidak valid",
      });
    }

    // Cek status kamar berdasarkan room_id
    const room = await Room.findOne({ where: { room_id } });

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    // Buat booking baru
    const booking = await Booking.create({
      booking_date: selectedDate, // Menyimpan tanggal booking
    });
    const booking_id = booking.booking_id;

    // Buat booking room baru
    const bookingRoom = await BookingRoom.create({
      booking_id,
      room_id,
      days,
    });

    // Ubah status kamar menjadi booked (status_id = 3)
    await Room.update({ status_id: 3 }, { where: { room_id } });

    res.status(201).json({
      status: "success",
      message: "Booking room berhasil dibuat dan ruangan ter-booked",
      data: bookingRoom,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal membuat booking room",
      error: err.message,
    });
  }
};

exports.updateBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;
  let { days, date } = req.body;

  // Validasi tanggal
  const today = new Date().setHours(0, 0, 0, 0); // Reset waktu ke awal hari
  let selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0); // Set waktu ke awal hari

  if (selectedDate < today) {
    return res.status(400).json({
      status: "error",
      message: "Tanggal tidak boleh kurang dari hari ini",
    });
  }

  try {
    // Cari booking_id terkait booking_room_id
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
      include: [{ model: Booking, as: 'booking' }] // Gunakan alias 'booking'
    });

    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Update days di tabel booking_room
    const [updatedBookingRoom] = await BookingRoom.update(
      { days },
      { where: { booking_room_id: bookingRoomId } }
    );

    // Update date di tabel booking
    const [updatedBooking] = await Booking.update(
      { booking_date: selectedDate }, // Pastikan date memiliki waktu 00:00:00
      { where: { booking_id: bookingRoom.booking_id } }
    );

    if (updatedBookingRoom === 0 && updatedBooking === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada perubahan yang dilakukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking room dan tanggal berhasil diperbarui",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui booking room dan tanggal",
      error: error.message,
    });
  }
};




// Menghapus booking room
exports.deleteBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;
  try {
    const deleted = await BookingRoom.destroy({
      where: { booking_room_id: bookingRoomId },
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus booking room",
      error: error.message,
    });
  }
};
