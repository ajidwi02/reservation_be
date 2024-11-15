const Room = require("../models/room");

// Mendapatkan data ruangan berdasarkan building_id
exports.getAllRoomsByBuildingId = async (req, res) => {
  const { id } = req.params;

  try {
    // Ambil semua ruangan berdasarkan building_id
    const results = await Room.getAllByBuildingId(id);

    // Cek apakah ada room_id 88 dengan status_name 'booked'
    const room88 = results.find(
      (room) => room.room_id === 88 && room.status_name === "booked"
    );

    // Cek apakah ada room_id 89 dengan status_name 'booked'
    const room89 = results.find(
      (room) => room.room_id === 89 && room.status_name === "booked"
    );

    // Jika room_id 88 dengan status_id 3 ditemukan, update room_id 12, 13, dan 89 menjadi status_id 2
    if (room88) {
      // Update room_id 12, 13, dan 89 menjadi status_id 2
      await Room.update({ status_id: 2 }, { where: { room_id: [12, 13, 89] } });
    }

    // Jika room_id 89 dengan status_id 3 ditemukan, update room_id 12, 13, 14, dan 88 menjadi status_id 2
    if (room89) {
      // Update room_id 12, 13, 14, dan 88 menjadi status_id 2
      await Room.update(
        { status_id: 2 },
        { where: { room_id: [12, 13, 14, 88] } }
      );
    }

    // Jika room_id 88 tidak ditemukan dengan status 'booked' atau status_id bukan 3, update room_id 12 dan 13 menjadi 1
    if (!room89) {
      if (!room88) {
        await Room.update(
          { status_id: 1 },
          { where: { room_id: [12, 13, 89] } }
        );
      }
    }
    if (!room88) {
      // Jika room_id 89 tidak ditemukan dengan status 'booked' atau status_id bukan 3, update room_id 12, 13, 14, dan 88 menjadi 1
      if (!room89) {
        await Room.update(
          { status_id: 1 },
          { where: { room_id: [12, 13, 14, 88] } }
        );
      }
    }
    // Kirimkan respons setelah update
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
  const roomId = req.params.id;
  const roomData = req.body;

  // Validasi request body
  if (!roomData || typeof roomData !== "object") {
    return res.status(400).json({
      status: "error",
      message: "Data yang dikirim tidak valid",
    });
  }

  try {
    const [updated] = await Room.update(roomData, {
      where: { room_id: roomId },
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
