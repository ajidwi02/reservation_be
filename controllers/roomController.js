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

    results.forEach((room) => {
      const roomNumber = parseInt(room.room_number); // Pastikan nomor kamar berupa angka

      if (roomNumber >= 101 && roomNumber <= 112) {
        floors["Lantai 1"].push(room);
      } else if (roomNumber >= 201 && roomNumber <= 213) {
        floors["Lantai 2"].push(room);
      } else if (roomNumber >= 301 && roomNumber <= 313) {
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

exports.updateRoom = async (req, res) => {
  const { roomIds, roomData } = req.body;

  // Validasi request body
  if (!Array.isArray(roomIds) || roomIds.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "roomIds harus berupa array yang berisi ID ruangan",
    });
  }

  if (!roomData || typeof roomData !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Data pembaruan ruangan tidak valid",
    });
  }

  try {
    const rooms = await Room.findAll({
      where: { room_id: roomIds },
    });

    if (rooms.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Ruangan tidak ditemukan",
      });
    }

    // Periksa apakah status_id yang ingin diupdate sudah sama dengan yang ada
    const roomsWithSameStatus = rooms.filter(
      (room) => room.status_id === roomData.status_id
    );

    if (roomsWithSameStatus.length > 0) {
      return res.status(200).json({
        status: "success",
        message:
          "Status ruangan sudah sesuai. Tidak ada perubahan yang diperlukan.",
      });
    }

    // Melakukan pembaruan jika status berbeda
    const [updated] = await Room.update(roomData, {
      where: { room_id: roomIds },
    });

    if (updated === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada ruangan yang ditemukan untuk diperbarui",
      });
    }

    // Ambil data ruangan yang sudah diperbarui
    const updatedRooms = await Room.findAll({
      where: { room_id: roomIds },
    });

    res.status(200).json({
      status: "success",
      message: "Ruangan berhasil diperbarui",
      data: updatedRooms,
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
      where: { room_id: id },
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
