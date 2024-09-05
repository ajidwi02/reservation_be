const RoomStatus = require("../models/roomStatus");

// Mendapatkan semua status ruangan
exports.getAllRoomStatuses = (req, res) => {
  RoomStatus.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data status ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data status ruangan berhasil diambil",
      data: results,
    });
  });
};

// Mendapatkan status ruangan berdasarkan ID
exports.getRoomStatusById = (req, res) => {
  const statusId = req.params.id;
  RoomStatus.getById(statusId, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data status ruangan",
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Status ruangan tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data status ruangan berhasil diambil",
      data: result,
    });
  });
};

// Membuat status ruangan baru
exports.createRoomStatus = (req, res) => {
  const statusName = req.body.statusName;
  RoomStatus.create(statusName, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal menambahkan status ruangan",
        error: err.message,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Status ruangan berhasil ditambahkan",
      data: results,
    });
  });
};

// Memperbarui status ruangan
exports.updateRoomStatus = (req, res) => {
  const statusId = req.params.id;
  const statusName = req.body.statusName;
  RoomStatus.update(statusId, statusName, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal memperbarui status ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Status ruangan berhasil diperbarui",
      data: results,
    });
  });
};

// Menghapus status ruangan
exports.deleteRoomStatus = (req, res) => {
  const statusId = req.params.id;
  RoomStatus.delete(statusId, (err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus status ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Status ruangan berhasil dihapus",
      data: results,
    });
  });
};
