const BookingDetail = require("../models/bookingDetail");
const BookingRoom = require("../models/bookingRoom");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Building = require("../models/building");
const { Op } = require("sequelize");

exports.createBookingDetail = async (req, res) => {
  try {
    const { booking_room_id, room_id, nomor_pesanan, days } = req.body;

    if (!booking_room_id || !room_id || !nomor_pesanan || !days) {
      return res.status(400).json({
        status: "error",
        message: "Semua field harus diisi",
      });
    }

    const newBookingDetail = await BookingDetail.create({
      booking_room_id,
      room_id,
      nomor_pesanan,
      days,
    });

    res.status(201).json({
      status: "success",
      message: "Booking detail berhasil dibuat",
      data: newBookingDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal membuat booking detail",
      error: error.message,
    });
  }
};

exports.getAllBookingDetails = async (req, res) => {
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
    const { count, rows } = await BookingDetail.findAndCountAll({
      where: searchQuery,
      include: [
        {
          model: BookingRoom,
          include: [
            {
              model: Booking,
              attributes: ["start_date", "end_date"],
            },
          ],
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
      order: [["booking_detail_id", "DESC"]], // Pengurutan berdasarkan booking_detail_id secara descending
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      status: "success",
      message: "Booking details berhasil diambil",
      data: rows,
      totalItems: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking detail",
      error: error.message,
    });
  }
};

exports.getBookingDetailsByBRoomId = async (req, res) => {
  const { booking_room_id } = req.params; // Ambil booking_room_id dari parameter URL
  const { page = 1, limit = 5, searchTerm } = req.query;

  const offset = (page - 1) * limit;

  // Definisikan query pencarian
  const searchQuery = searchTerm
    ? {
        [Op.or]: [
          { "$Room.room_number$": { [Op.like]: `%${searchTerm}%` } },
          { "$Room.Building.name$": { [Op.like]: `%${searchTerm}%` } },
        ],
      }
    : {};

  try {
    const { count, rows } = await BookingDetail.findAndCountAll({
      where: {
        booking_room_id, // Filter berdasarkan booking_room_id
        ...searchQuery, // Tambahkan kondisi pencarian
      },
      include: [
        {
          model: BookingRoom,
          include: [
            {
              model: Booking,
              attributes: ["start_date", "end_date"],
            },
          ],
        },
        {
          model: Room, // Relasi langsung dari BookingDetail ke Room
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["booking_detail_id", "DESC"]], // Pengurutan berdasarkan booking_detail_id secara descending
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    if (rows.length === 0) {
      // Jika tidak ada data yang ditemukan, kembalikan data kosong
      return res.status(200).json({
        status: "success",
        message: "Booking detail tidak ditemukan, tetapi pencarian berhasil",
        data: [], // Data kosong karena tidak ada hasil yang cocok
        totalItems: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking details berhasil diambil",
      data: rows,
      totalItems: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking detail",
      error: error.message,
    });
  }
};

exports.getBookingDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const bookingDetail = await BookingDetail.findByPk(id);

    if (!bookingDetail) {
      return res.status(404).json({
        status: "error",
        message: "Booking detail tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      data: bookingDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking detail",
      error: error.message,
    });
  }
};

exports.deleteBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const rowsDeleted = await BookingDetail.destroy({
      where: { booking_detail_id: id },
    });

    if (rowsDeleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Booking detail tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking detail berhasil dihapus",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus booking detail",
      error: error.message,
    });
  }
};
