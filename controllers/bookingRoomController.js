const BookingRoom = require("../models/bookingRoom");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Building = require("../models/building");
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

exports.getDatesByBookingRoomId = async (req, res) => {
  const bookingRoomId = req.params.id;

  try {
    // Langkah 1: Ambil room_id dari booking_room berdasarkan booking_room_id
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId }, // Menggunakan booking_room_id untuk mendapatkan room_id
    });

    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    const roomId = bookingRoom.room_id; // Dapatkan room_id dari booking_room

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
      const start_date = booking.Booking.start_date;
      const end_date = booking.Booking.end_date;

      return {
        start_date: start_date,
        end_date: end_date,
      };
    });

    // Jika tidak ada booking untuk room_id tersebut
    if (bookings.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada booking untuk room_id yang diberikan",
      });
    }

    // Kirimkan response dengan seluruh tanggal yang ditemukan
    res.status(200).json({
      status: "success",
      message: "Tanggal booking berhasil diambil",
      data: bookedDates,
    });
  } catch (error) {
    console.error("Error saat mengambil tanggal booking:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil tanggal booking",
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
    const room = await Room.findOne({
      where: { room_id },
      include: [{ model: Building, attributes: ["name"] }], // Pastikan Building dan nama diambil
    });

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

    const buildingMap = {
      GedungA: "GAA",
      GedungB: "GAB",
      GedungC: "AC",
    };

    // Dapatkan building name sesuai dengan map, atau gunakan nama asli jika tidak ada di map
    const buildingName =
      buildingMap[room.Building.name.replace(/\s+/g, "")] ||
      room.Building.name.replace(/\s+/g, "");

    const roomNameMap = {
      "R.Transit": "RT",
      Lapangan: "L",
      RRKecilA: "RRKA",
      RRKecilB: "RRKB",
      RRBesarC: "RRBC",
      RRBesarAB: "RRBAB",
    };

    // console.log("Building Name:", buildingName);
    const roomName =
      roomNameMap[room.room_number.replace(/\s+/g, "")] ||
      room.room_number.replace(/\s+/g, "");

    // console.log("Building Name:", roomName);
    // Ambil bagian hari, bulan, dan tahun dari startDate
    const day = String(startDate.getDate()).padStart(2, "0"); // Pastikan memiliki dua digit
    const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Bulan mulai dari 0, jadi tambahkan 1
    const year = startDate.getFullYear();

    // Gabungkan menjadi format DDMMYYYY
    const formattedDate = `${day}${month}${year}`;
    const nomor_pesanan = `${buildingName}${roomName}${formattedDate}`;
    // console.log("Generated nomor_pesanan:", nomor_pesanan);

    // Buat booking room baru
    const bookingRoom = await BookingRoom.create({
      booking_id,
      room_id,
      days,
      nomor_pesanan,
    });

    // Reset waktu startDate dan today ke awal hari
    startDate.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC
    const todayH = new Date();
    todayH.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC

    // Ubah status kamar menjadi booked (status_id = 3) jika start_date adalah hari ini
    if (startDate.getTime() === todayH.getTime()) {
      // Ubah status kamar yang dipesan menjadi booked (status_id = 3)
      await Room.update({ status_id: 3 }, { where: { room_id } });

      // Logika tambahan untuk kamar terkait
      const relatedRooms = [];
      if (room_id === 88) {
        relatedRooms.push(...[12, 13, 89]);
      } else if ([12, 13].includes(room_id)) {
        relatedRooms.push(...[88, 89]);
      } else if (room_id === 14) {
        relatedRooms.push(89);
      } else if (room_id === 89) {
        relatedRooms.push(...[12, 13, 14, 88]);
      }

      // Perbarui status kamar terkait jika ada
      if (relatedRooms.length > 0) {
        await Room.update(
          { status_id: 2 }, // Set status kamar terkait menjadi "dalam pemakaian" (status_id = 2)
          { where: { room_id: { [Op.in]: relatedRooms } } }
        );
      }
    }

    // if (room_id === 88) {
    //   await Room.update({ status_id: 2 }, { where: { room_id: [12, 13] } });
    // } else if (room_id === 89) {
    //   await Room.update({ status_id: 2 }, { where: { room_id: [12, 13, 88] } });
    // }

    // Tambahkan data ke tabel history_booking_rooms
    await HistoryBookingRoom.create({
      booking_room_id: bookingRoom.booking_room_id,
      room_id: bookingRoom.room_id,
      days: bookingRoom.days,
      nomor_pesanan: bookingRoom.nomor_pesanan, // Tambahkan nomor_pesanan di sini
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
    console.error("Error:", err);
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
      include: [{ model: Booking }, { model: Room, include: [Building] }],
    });

    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Cek tumpang tindih dengan booking lain
    const overlappingBooking = await BookingRoom.findOne({
      where: {
        room_id: bookingRoom.room_id,
        booking_room_id: { [Op.ne]: bookingRoomId }, // Tidak termasuk booking yang sedang di-update
      },
      include: [
        {
          model: Booking,
          where: {
            [Op.or]: [
              {
                start_date: { [Op.lte]: endDate },
                end_date: { [Op.gte]: startDate },
              },
            ],
          },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        status: "error",
        message: "Tanggal Sudah Dipesan",
      });
    }

    // Hapus riwayat sebelumnya di tabel history_booking_rooms
    await HistoryBookingRoom.destroy({
      where: { booking_room_id: bookingRoomId },
    });

    // Buat nomor pesanan sesuai map building
    const buildingMap = { GedungA: "GAA", GedungB: "GAB", GedungC: "AC" };
    const buildingName =
      buildingMap[bookingRoom.Room.Building.name.replace(/\s+/g, "")] ||
      bookingRoom.Room.Building.name.replace(/\s+/g, "");
    const roomNameMap = {
      "R.Transit": "RT",
      Lapangan: "L",
      RRKecilA: "RRKA",
      RRKecilB: "RRKB",
      RRBesarC: "RRBC",
      RRBesarAB: "RRBAB",
    };

    const roomName =
      roomNameMap[bookingRoom.Room.room_number.replace(/\s+/g, "")] ||
      bookingRoom.Room.room_number.replace(/\s+/g, "");
    const day = String(startDate.getDate()).padStart(2, "0");
    const month = String(startDate.getMonth() + 1).padStart(2, "0");
    const year = startDate.getFullYear();
    const formattedDate = `${day}${month}${year}`;
    const nomor_pesanan = `${buildingName}${roomName}${formattedDate}`;

    // Update tabel BookingRoom
    const [updatedBookingRoom] = await BookingRoom.update(
      { days, nomor_pesanan },
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
    // Tambahkan entri baru di tabel history_booking_rooms
    await HistoryBookingRoom.create({
      booking_room_id: bookingRoomId,
      room_id: bookingRoom.room_id,
      days: days, // Menggunakan nilai days yang dihitung
      nomor_pesanan: nomor_pesanan, // Tambahkan nomor_pesanan di sini
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
    // Cari booking_room yang ingin dihapus
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
    const roomId = bookingRoom.room_id;

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

    // Ubah status room menjadi 1 (tersedia)
    await Room.update({ status_id: 1 }, { where: { room_id: roomId } });

    // Logika khusus untuk room_id terkait
    if (roomId === 88) {
      await Room.update(
        { status_id: 1 },
        { where: { room_id: { [Op.in]: [12, 13, 89] } } }
      );
    } else if (roomId === 14) {
      await Room.update({ status_id: 1 }, { where: { room_id: 89 } });
    } else if (roomId === 89) {
      await Room.update(
        { status_id: 1 },
        { where: { room_id: { [Op.in]: [12, 13, 14, 88] } } }
      );
    }

    // Logika tambahan untuk room_id 12 dan 13
    if ([12, 13].includes(roomId)) {
      // Periksa apakah masih ada booking aktif untuk room_id 12 atau 13
      const activeBookingRooms = await BookingRoom.count({
        where: { room_id: { [Op.in]: [12, 13] } },
      });

      if (activeBookingRooms === 0) {
        // Jika tidak ada booking aktif, ubah status 88 dan 89 menjadi 1
        await Room.update(
          { status_id: 1 },
          { where: { room_id: { [Op.in]: [88, 89] } } }
        );
      }
    }

    // Mengembalikan respons sukses
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil dihapus, status kamar diperbarui.",
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
