const BookingRoom = require("../models/bookingRoom");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Building = require("../models/building"); // Tambahkan import Building
const HistoryBookingRoom = require('../models/historyBR');
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


// Mendapatkan booking room berdasarkan room_id
exports.getBookingRoomByRoomId = async (req, res) => {
  const roomId = req.params.id; // Ambil room_id dari parameter
  try {
    const bookingRoom = await BookingRoom.findOne({
      where: { room_id: roomId }, // Mencari berdasarkan room_id
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
      return ({
        status: "warning",
        message: "Ruangan Dapat Digunakan",
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
    // Set jam menjadi 07:00
    selectedDate.setHours(7, 0, 0, 0); // Set jam ke 07:00:00.000

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

    // Tambahkan data ke tabel history_booking_rooms
    await HistoryBookingRoom.create({
      booking_room_id: bookingRoom.booking_room_id,
      room_id: bookingRoom.room_id,
      days: bookingRoom.days,
      date: selectedDate, // Menggunakan tanggal yang sudah di-set sebelumnya
      changed_at: new Date(), // Timestamp perubahan saat ini
    });

    res.status(201).json({
      status: "success",
      message: "Booking room berhasil dibuat, riwayat dicatat, dan ruangan ter-booked",
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
  selectedDate.setHours(7, 0, 0, 0); // Set waktu ke 07:00:00

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
      include: [Booking],
    });

    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Hapus riwayat sebelumnya di tabel history_booking_rooms
    await HistoryBookingRoom.destroy({
      where: { booking_room_id: bookingRoomId },
    });

    // Update days di tabel booking_room
    const [updatedBookingRoom] = await BookingRoom.update(
      { days },
      { where: { booking_room_id: bookingRoomId } }
    );

    // Update date di tabel booking
    const [updatedBooking] = await Booking.update(
      { booking_date: selectedDate },
      { where: { booking_id: bookingRoom.booking_id } }
    );

    // Periksa jika ada yang diperbarui
    if (updatedBookingRoom === 0 && updatedBooking === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada perubahan yang dilakukan",
      });
    }

    // Tambahkan entri baru di tabel history_booking_rooms
    await HistoryBookingRoom.create({
      booking_room_id: bookingRoomId,
      room_id: bookingRoom.room_id,
      days: days,
      date: selectedDate,
      changed_at: new Date(), // Timestamp perubahan saat ini
    });

    res.status(200).json({
      status: "success",
      message: "Booking room, tanggal, dan riwayat berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating booking room:", error); // Tambahkan log untuk debugging
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui booking room, tanggal, dan riwayat",
      error: error.message,
    });
  }
};



// Menghapus booking room
exports.deleteBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;
  try {
    // Pertama, cari booking_room yang ingin dihapus
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
    });

    // Jika tidak ditemukan, kembalikan status 404
    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Ambil booking_id dari booking room yang ditemukan
    const bookingId = bookingRoom.booking_id;

    // Hapus booking room berdasarkan ID
    const deleted = await BookingRoom.destroy({
      where: { booking_room_id: bookingRoomId },
    });

    // Jika tidak ada booking room yang dihapus, kembalikan status 404
    if (deleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Memeriksa apakah ada booking room lain untuk booking_id yang sama
    const bookingRoomCount = await BookingRoom.count({
      where: { booking_id: bookingId },
    });

    // Jika tidak ada booking room yang tersisa, hapus booking
    if (bookingRoomCount === 0) {
      await Booking.destroy({
        where: { booking_id: bookingId },
      });
    }

    // Mengembalikan respons sukses, tanpa menyentuh data di history_booking_rooms
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil dihapus, data history booking tetap ada",
    });
  } catch (error) {
    // Menangani kesalahan
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus booking room",
      error: error.message,
    });
  }
};

