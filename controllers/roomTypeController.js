const RoomType = require("../models/roomType");

// Mendapatkan semua tipe ruangan
exports.getAllRoomTypes = (req, res) => {
  RoomType.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data tipe ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data tipe ruangan berhasil diambil",
      data: results,
    });
  });
};

// Mendapatkan tipe ruangan berdasarkan ID
exports.getRoomTypeById = (req, res) => {
  const typeId = req.params.id;
  RoomType.getById(typeId, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data tipe ruangan",
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tipe ruangan tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data tipe ruangan berhasil diambil",
      data: result,
    });
  });
};

// Membuat tipe ruangan baru
exports.createRoomType = (req, res) => {
  const typeName = req.body.typeName;
  RoomType.create(typeName, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal menambahkan tipe ruangan",
        error: err.message,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Tipe ruangan berhasil ditambahkan",
      data: results,
    });
  });
};

// Memperbarui tipe ruangan
exports.updateRoomType = (req, res) => {
  const typeId = req.params.id;
  const typeName = req.body.typeName;
  RoomType.update(typeId, typeName, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal memperbarui tipe ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Tipe ruangan berhasil diperbarui",
      data: results,
    });
  });
};

// Menghapus tipe ruangan
exports.deleteRoomType = (req, res) => {
  const typeId = req.params.id;
  RoomType.delete(typeId, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus tipe ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Tipe ruangan berhasil dihapus",
      data: results,
    });
  });
};
