const Room = require("../models/room");

// Mendapatkan semua data ruangan
exports.getAllRooms = (req, res) => {
  Room.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data ruangan berhasil diambil",
      data: results,
    });
  });
};

// Mendapatkan data ruangan berdasarkan ID
exports.getRoomById = (req, res) => {
  const id = req.params.id;
  Room.getById(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data ruangan",
        error: err.message,
      });
    }
    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Data ruangan berhasil diambil",
      data: result[0],
    });
  });
};

// Membuat ruangan baru
exports.createRoom = (req, res) => {
  const roomData = req.body;
  Room.create(roomData, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal menambahkan ruangan",
        error: err.message,
      });
    }

    res.status(201).json({
      status: "success",
      message: "Ruangan berhasil ditambahkan",
      data: { room_id: result.insertId, ...roomData },
    });
  });
};

// Memperbarui data ruangan
exports.updateRoom = (req, res) => {
  const roomId = req.params.id; // ID ruangan yang akan di-update
  const roomData = req.body; // Data ruangan yang akan di-update

  Room.update(roomId, roomData, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal memperbarui ruangan",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    // Ambil data yang sudah di-update dari database
    Room.getById(roomId, (err, updatedRoom) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Gagal mengambil data ruangan yang diperbarui",
          error: err.message,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Ruangan berhasil diperbarui",
        data: updatedRoom, // Mengirim data ruangan yang diperbarui
      });
    });
  });
};

// Menghapus ruangan
exports.deleteRoom = (req, res) => {
  const id = req.params.id;
  Room.delete(id, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus ruangan",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Ruangan berhasil dihapus",
    });
  });
};
