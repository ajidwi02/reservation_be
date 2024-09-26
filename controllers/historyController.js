const HistoryBookingRoom = require('../models/historyBR');
const { Room, Building } = require('../models'); // Sesuaikan path jika diperlukan

exports.getAllHistory = async (req, res) => {
  try {
    const history = await HistoryBookingRoom.findAll({
      include: [
        {
          model: Room,
          attributes: ['room_number'],
          include: [
            {
              model: Building,
              attributes: ['name']
            }
          ]
        }
      ]
    });

    console.log('Data history:', JSON.stringify(history, null, 2)); // Log data yang diambil

    res.status(200).json({
      status: 'success',
      message: 'Data semua riwayat berhasil diambil.',
      data: history
    });
  } catch (error) {
    console.error('Error fetching history:', error); // Log kesalahan
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil data riwayat.',
      data: null
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
        status: 'error',
        message: 'Riwayat tidak ditemukan.',
        data: null
      });
    }
    res.status(200).json({
      status: 'success',
      message: `Riwayat dengan ID ${id} berhasil ditemukan.`,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil data riwayat.',
      data: null
    });
  }
};

// Menambahkan riwayat booking room baru
exports.createHistory = async (req, res) => {
  const { booking_room_id, room_id, days, date } = req.body; // status_id dihapus
  try {
    const newHistory = await HistoryBookingRoom.create({
      booking_room_id,
      room_id,
      days,
      date,
    });
    res.status(201).json({
      status: 'success',
      message: 'Riwayat baru berhasil ditambahkan.',
      data: newHistory
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menambahkan data riwayat.',
      data: null
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
        status: 'error',
        message: 'Riwayat tidak ditemukan.',
        data: null
      });
    }
    await history.destroy();
    res.status(200).json({
      status: 'success',
      message: 'Riwayat berhasil dihapus.',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menghapus data riwayat.',
      data: null
    });
  }
};
