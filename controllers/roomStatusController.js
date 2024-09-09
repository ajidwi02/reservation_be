const RoomStatus = require('../models/roomStatus');

// Mendapatkan semua status ruangan
exports.getAllRoomStatuses = async (req, res) => {
  try {
    const statuses = await RoomStatus.findAll();
    res.status(200).json({
      status: 'success',
      message: 'Data status ruangan berhasil diambil',
      data: statuses
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data status ruangan',
      error: err.message
    });
  }
};

// Mendapatkan status ruangan berdasarkan ID
exports.getRoomStatusById = async (req, res) => {
  const statusId = req.params.id;
  try {
    const status = await RoomStatus.findByPk(statusId);
    if (!status) {
      return res.status(404).json({
        status: 'error',
        message: 'Status ruangan tidak ditemukan'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Data status ruangan berhasil diambil',
      data: status
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data status ruangan',
      error: err.message
    });
  }
};

// Membuat status ruangan baru
exports.createRoomStatus = async (req, res) => {
  const { statusName } = req.body;
  try {
    const status = await RoomStatus.create({ status_name: statusName });
    res.status(201).json({
      status: 'success',
      message: 'Status ruangan berhasil ditambahkan',
      data: status
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan status ruangan',
      error: err.message
    });
  }
};

// Memperbarui status ruangan
exports.updateRoomStatus = async (req, res) => {
  const statusId = req.params.id;
  const { statusName } = req.body;
  try {
    const [updated] = await RoomStatus.update(
      { status_name: statusName },
      { where: { status_id: statusId } }
    );
    if (updated === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Status ruangan tidak ditemukan'
      });
    }
    const updatedStatus = await RoomStatus.findByPk(statusId);
    res.status(200).json({
      status: 'success',
      message: 'Status ruangan berhasil diperbarui',
      data: updatedStatus
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui status ruangan',
      error: err.message
    });
  }
};

// Menghapus status ruangan
exports.deleteRoomStatus = async (req, res) => {
  const statusId = req.params.id;
  try {
    const deleted = await RoomStatus.destroy({
      where: { status_id: statusId }
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Status ruangan tidak ditemukan'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Status ruangan berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus status ruangan',
      error: err.message
    });
  }
};
