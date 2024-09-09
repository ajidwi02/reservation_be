const RoomType = require('../models/roomType');

// Mendapatkan semua tipe ruangan
exports.getAllRoomTypes = async (req, res) => {
  try {
    const types = await RoomType.findAll();
    res.status(200).json({
      status: 'success',
      message: 'Data tipe ruangan berhasil diambil',
      data: types
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data tipe ruangan',
      error: err.message
    });
  }
};

// Mendapatkan tipe ruangan berdasarkan ID
exports.getRoomTypeById = async (req, res) => {
  const typeId = req.params.id;
  try {
    const type = await RoomType.findByPk(typeId);
    if (!type) {
      return res.status(404).json({
        status: 'error',
        message: 'Tipe ruangan tidak ditemukan'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Data tipe ruangan berhasil diambil',
      data: type
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data tipe ruangan',
      error: err.message
    });
  }
};

// Membuat tipe ruangan baru
exports.createRoomType = async (req, res) => {
  const { typeName } = req.body;
  try {
    const type = await RoomType.create({ type_name: typeName });
    res.status(201).json({
      status: 'success',
      message: 'Tipe ruangan berhasil ditambahkan',
      data: type
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan tipe ruangan',
      error: err.message
    });
  }
};

// Memperbarui tipe ruangan
exports.updateRoomType = async (req, res) => {
  const typeId = req.params.id;
  const { typeName } = req.body;
  try {
    const [updated] = await RoomType.update(
      { type_name: typeName },
      { where: { room_type_id: typeId } }
    );
    if (updated === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tipe ruangan tidak ditemukan'
      });
    }
    const updatedType = await RoomType.findByPk(typeId);
    res.status(200).json({
      status: 'success',
      message: 'Tipe ruangan berhasil diperbarui',
      data: updatedType
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui tipe ruangan',
      error: err.message
    });
  }
};

// Menghapus tipe ruangan
exports.deleteRoomType = async (req, res) => {
  const typeId = req.params.id;
  try {
    const deleted = await RoomType.destroy({
      where: { room_type_id: typeId }
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tipe ruangan tidak ditemukan'
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Tipe ruangan berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus tipe ruangan',
      error: err.message
    });
  }
};
