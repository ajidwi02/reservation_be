const HistoryBookingRoom = require("../models/historyBR");
const { Room, Building } = require("../models"); // Sesuaikan path jika diperlukan
const { Op } = require("sequelize");

exports.getAllHistory = async (req, res) => {
  try {
    const { searchTerm, page = 1, limit = 5 } = req.query;

    const offset = (page - 1) * limit;

    // Filter pencarian
    let searchFilter = {};
    if (searchTerm) {
      searchFilter = {
        [Op.or]: [
          { "$Room.room_number$": { [Op.like]: `%${searchTerm}%` } },
          { "$Room.Building.name$": { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    const { count, rows } = await HistoryBookingRoom.findAndCountAll({
      distinct: true,
      where: searchFilter,
      include: [
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
      order: [["id", "DESC"]],

      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      status: "success",
      message: "Data riwayat berhasil diambil.",
      data: rows,
      totalItems: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data riwayat.",
      data: null,
    });
  }
};

// Mendapatkan satu riwayat berdasarkan ID
exports.getHistoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await HistoryBookingRoom.findByPk(id);
    if (!history) {
      return res.status(404).json({
        status: "error",
        message: "Riwayat tidak ditemukan.",
        data: null,
      });
    }
    res.status(200).json({
      status: "success",
      message: `Riwayat dengan ID ${id} berhasil ditemukan.`,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengambil data riwayat.",
      data: null,
    });
  }
};

// Menambahkan riwayat booking room baru
exports.createHistory = async (req, res) => {
  const { booking_room_id, room_id, days, start_date, end_date } = req.body; // Mengganti 'date' dengan 'start_date' dan 'end_date'

  try {
    const newHistory = await HistoryBookingRoom.create({
      booking_room_id,
      room_id,
      days,
      start_date, // Menggunakan start_date yang diterima dari permintaan
      end_date, // Menggunakan end_date yang diterima dari permintaan
      changed_at: new Date(), // Menambahkan timestamp perubahan saat ini
    });

    res.status(201).json({
      status: "success",
      message: "Riwayat baru berhasil ditambahkan.",
      data: newHistory,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat menambahkan data riwayat.",
      data: null,
    });
  }
};

// Menghapus riwayat berdasarkan ID
exports.deleteHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const history = await HistoryBookingRoom.findByPk(id);
    if (!history) {
      return res.status(404).json({
        status: "error",
        message: "Riwayat tidak ditemukan.",
        data: null,
      });
    }
    await history.destroy();
    res.status(200).json({
      status: "success",
      message: "Riwayat berhasil dihapus.",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat menghapus data riwayat.",
      data: null,
    });
  }
};
