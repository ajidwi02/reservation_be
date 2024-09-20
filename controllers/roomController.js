const Room = require("../models/room");

// Mendapatkan data ruangan berdasarkan building_id
exports.getAllRoomsByBuildingId = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await Room.getAllByBuildingId(id);
    res.status(200).json({
      status: "success",
      message: "Data ruangan berdasarkan building_id berhasil diambil",
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data ruangan berdasarkan building_id",
      error: err.message,
    });
  }
};
exports.getAllRoomsByBuildingFloorId = async (req, res) => {
  const { id } = req.params;

  try {
    // Mengambil semua ruangan berdasarkan building_id
    const results = await Room.getAllByBuildingId(id);

    // Mengelompokkan ruangan berdasarkan lantai
    const floors = {
      "Lantai 1": [],
      "Lantai 2": [],
      "Lantai 3": [],
    };

    results.forEach(room => {
      if (room.room_number.startsWith("A")) {
        floors["Lantai 1"].push(room);
      } else if (room.room_number.startsWith("B")) {
        floors["Lantai 2"].push(room);
      } else if (room.room_number.startsWith("C")) {
        floors["Lantai 3"].push(room);
      }
    });

    res.status(200).json({
      status: "success",
      message: "Data ruangan berdasarkan building_id berhasil diambil",
      data: floors,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data ruangan berdasarkan building_id",
      error: err.message,
    });
  }
};

// Mendapatkan data ruangan berdasarkan ID
exports.getRoomById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Room.getById(id);
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
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data ruangan",
      error: err.message,
    });
  }
};

// Membuat ruangan baru
exports.createRoom = async (req, res) => {
  const roomData = req.body;
  try {
    const newRoom = await Room.create(roomData);
    res.status(201).json({
      status: "success",
      message: "Ruangan berhasil ditambahkan",
      data: newRoom,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan ruangan",
      error: err.message,
    });
  }
};

// Memperbarui data ruangan
exports.updateRoom = async (req, res) => {
  const roomId = req.params.id;
  const roomData = req.body;

  try {
    const [updated] = await Room.update(roomData, {
      where: { room_id: roomId }
    });
    if (updated === 0) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    const updatedRoom = await Room.findByPk(roomId);
    res.status(200).json({
      status: "success",
      message: "Ruangan berhasil diperbarui",
      data: updatedRoom,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui ruangan",
      error: err.message,
    });
  }
};

// Menghapus ruangan
exports.deleteRoom = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Room.destroy({
      where: { room_id: id }
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Ruangan berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus ruangan",
      error: err.message,
    });
  }
};
