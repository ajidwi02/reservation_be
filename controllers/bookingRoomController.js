const BookingRoom = require("../models/bookingRoom");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Building = require("../models/building"); // Tambahkan import Building
const HistoryBookingRoom = require("../models/historyBR");
// Mendapatkan semua booking rooms
const { Op } = require("sequelize");

exports.getAllBookingRooms = async (req, res) => {
  const { page = 1, limit = 5, searchTerm } = req.query;

  const offset = (page - 1) * limit;
  const searchQuery = searchTerm
    ? {
        [Op.or]: [
          { "$Room.room_number$": { [Op.like]: `%${searchTerm}%` } },
          { "$Room.Building.name$": { [Op.like]: `%${searchTerm}%` } },
        ],
      }
    : {};

  try {
    const { count, rows } = await BookingRoom.findAndCountAll({
      where: searchQuery,
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"],
        },
        {
          model: Room,
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      status: "success",
      message: "Booking rooms berhasil diambil",
      data: rows,
      totalItems: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
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
          attributes: ["start_date", "end_date"], // Mengambil start_date dan end_date
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
  const roomId = req.params.id;
  try {
    const bookingRooms = await BookingRoom.findAll({
      where: { room_id: roomId }, // Mendapatkan semua booking untuk room_id ini
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"],
        },
        {
          model: Room,
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!bookingRooms || bookingRooms.length === 0) {
      return res.status(204).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking room berhasil diambil",
      data: bookingRooms, // Kirim semua booking
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking room",
      error: error.message,
    });
  }
};

// Mendapatkan tanggal yang sudah dipesan untuk ruangan tertentu
exports.getBookedDatesByRoomId = async (req, res) => {
  const roomId = req.params.id;
  try {
    const bookings = await BookingRoom.findAll({
      where: { room_id: roomId },
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"],
        },
      ],
    });

    const bookedDates = bookings.map((booking) => {
      return {
        start_date: booking.Booking.start_date,
        end_date: booking.Booking.end_date,
      };
    });

    res.status(200).json({
      status: "success",
      message: "Tanggal yang sudah dipesan berhasil diambil",
      data: bookedDates,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil tanggal yang sudah dipesan",
      error: error.message,
    });
  }
};

// Membuat booking room baru
exports.createBookingRoom = async (req, res) => {
  try {
    const { room_id, start_date, end_date } = req.body;

    // Validasi tanggal
    if (!start_date || !end_date) {
      return res.status(400).json({
        status: "error",
        message: "Start date dan End date tidak boleh kosong",
      });
    }

    // Mengonversi tanggal ke objek Date
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Validasi apakah startDate lebih besar dari endDate
    if (startDate > endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date tidak boleh lebih besar dari End date",
      });
    }

    // Set jam ke 08:00 untuk start date dan 16:00 untuk end date
    startDate.setHours(8, 0, 0, 0); // Set jam lokal ke 08:00
    endDate.setHours(16, 0, 0, 0); // Set jam lokal ke 16:00

    // Validasi objek Date
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal tidak valid",
      });
    }

    // Cek jika startDate kurang dari hari ini
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC

    if (startDate < today) {
      return res.status(400).json({
        status: "error",
        message: "Tidak bisa booking sebelum hari ini",
      });
    }

    const existingBookingRoom = await BookingRoom.findOne({
      where: {
        room_id,
      },
      include: [
        {
          model: Booking,
          where: {
            [Op.or]: [
              {
                start_date: {
                  [Op.lte]: endDate,
                },
                end_date: {
                  [Op.gte]: startDate,
                },
              },
            ],
          },
        },
      ],
    });

    if (existingBookingRoom) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal Sudah Dipesan",
      });
    }


    // Hitung jumlah hari antara start_date dan end_date
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Cek status kamar berdasarkan room_id
    const room = await Room.findOne({ where: { room_id } });

    if (!room) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    // Buat booking baru dengan start_date dan end_date
    const booking = await Booking.create({
      start_date: startDate,
      end_date: endDate,
    });
    const booking_id = booking.booking_id;

    // Buat booking room baru
    const bookingRoom = await BookingRoom.create({
      booking_id,
      room_id,
      days, // Menggunakan nilai days yang dihitung
    });

    // Reset waktu startDate dan today ke awal hari
    startDate.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC
    const todayH = new Date();
    todayH.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC

    // Ubah status kamar menjadi booked (status_id = 3) jika start_date adalah hari ini
    if (startDate.getTime() === todayH.getTime()) {
      await Room.update({ status_id: 3 }, { where: { room_id } });
    }

    // Tambahkan data ke tabel history_booking_rooms
    await HistoryBookingRoom.create({
      booking_room_id: bookingRoom.booking_room_id,
      room_id: bookingRoom.room_id,
      days: bookingRoom.days,
      start_date: startDate,
      end_date: endDate,
      changed_at: new Date(), // Timestamp perubahan saat ini
    });

    res.status(201).json({
      status: "success",
      message:
        "Booking room berhasil dibuat, riwayat dicatat, dan ruangan ter-booked",
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
  let { start_date, end_date } = req.body;

  // Validasi tanggal
  let startDate = new Date(start_date);
  let endDate = new Date(end_date);

  // Set jam untuk start_date ke 07:00 dan end_date ke 16:00
  startDate.setHours(7, 0, 0, 0); // Set start date ke jam 07:00
  endDate.setHours(16, 0, 0, 0); // Set end date ke jam 16:00

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset jam ke awal hari

  // Validasi jika start_date dan end_date kurang dari hari ini
  if (startDate < today || endDate < today) {
    return res.status(400).json({
      status: "error",
      message: "Tanggal tidak boleh kurang dari hari ini",
    });
  }

  // Validasi jika start_date lebih besar dari end_date
  if (startDate > endDate) {
    return res.status(400).json({
      status: "error",
      message: "Start date tidak boleh lebih besar dari End date",
    });
  }

  // Hitung jumlah hari antara start_date dan end_date
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

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
      { days }, // Menggunakan nilai days yang dihitung
      { where: { booking_room_id: bookingRoomId } }
    );

    // Update start_date dan end_date di tabel booking
    const [updatedBooking] = await Booking.update(
      { start_date: startDate, end_date: endDate },
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
      days: days, // Menggunakan nilai days yang dihitung
      start_date: startDate,
      end_date: endDate,
      changed_at: new Date(), // Timestamp perubahan saat ini
    });

    // Set jam startDate dan today ke awal hari untuk perbandingan yang tepat
    startDate.setHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC
    today.setHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC

    // Update status_id di tabel room berdasarkan perbandingan startDate dengan today
    // Perbandingan status_id
    let newStatusId;
    if (new Date(start_date).setHours(0, 0, 0, 0) === today.getTime()) {
      newStatusId = 3; // Ganti status_id ke 3 jika start_date adalah hari ini
    } else {
      newStatusId = 1; // Ganti status_id ke 1 jika start_date bukan hari ini
    }

    await Room.update(
      { status_id: newStatusId },
      { where: { room_id: bookingRoom.room_id } }
    );

    res.status(200).json({
      status: "success",
      message:
        "Booking room, tanggal, status kamar, dan riwayat berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating booking room:", error); // Tambahkan log untuk debugging
    res.status(500).json({
      status: "error",
      message:
        "Gagal memperbarui booking room, tanggal, status kamar, dan riwayat",
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

    // Ambil booking_id dan room_id dari booking room yang ditemukan
    const bookingId = bookingRoom.booking_id;
    const roomId = bookingRoom.room_id; // Ambil room_id terkait

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

    // Ubah status room menjadi 1 (menandakan tersedia)
    await Room.update(
      { status_id: 1 }, // Update status room menjadi 1
      { where: { room_id: roomId } } // Berdasarkan room_id terkait
    );

    // Mengembalikan respons sukses, tanpa menyentuh data di history_booking_rooms
    res.status(200).json({
      status: "success",
      message:
        "Booking room berhasil dihapus, status room diperbarui menjadi 1",
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
