const Building = require("../models/building");

exports.getAllBuildings = async (req, res) => {
  try {
    const results = await Building.findAll();
    res.status(200).json({
      status: "success",
      message: "Data gedung berhasil diambil",
      data: results,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data gedung",
      error: err.message,
    });
  }
};

exports.getBuildingById = async (req, res) => {
  const buildingId = req.params.id;

  try {
    const building = await Building.findByPk(buildingId);
    if (building) {
      res.status(200).json({
        status: "success",
        message: "Data gedung berhasil diambil",
        data: building,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Gedung tidak ditemukan",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data gedung",
      error: err.message,
    });
  }
};

exports.createBuilding = async (req, res) => {
  const { name } = req.body;

  try {
    const newBuilding = await Building.create({ name });
    res.status(201).json({
      status: "success",
      message: "Gedung berhasil ditambahkan",
      data: newBuilding,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan gedung",
      error: err.message,
    });
  }
};

exports.updateBuilding = async (req, res) => {
  const buildingId = req.params.id;
  const { name } = req.body;

  try {
    const [updated] = await Building.update({ name }, {
      where: { building_id: buildingId }
    });
    if (updated) {
      const updatedBuilding = await Building.findByPk(buildingId);
      res.status(200).json({
        status: "success",
        message: "Gedung berhasil diperbarui",
        data: updatedBuilding,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Gedung tidak ditemukan",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui gedung",
      error: err.message,
    });
  }
};

exports.deleteBuilding = async (req, res) => {
  const buildingId = req.params.id;

  try {
    const deleted = await Building.destroy({
      where: { building_id: buildingId }
    });
    if (deleted) {
      res.status(200).json({
        status: "success",
        message: "Gedung berhasil dihapus",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Gedung tidak ditemukan",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus gedung",
      error: err.message,
    });
  }
};

// controllers/buildingController.js
exports.getAllWithRoomStatus = async (req, res) => {
  try {
    const results = await Building.getAllWithRoomStatus();

    const groupedResults = results.reduce((acc, curr) => {
      // Cari gedung berdasarkan building_id
      let building = acc.find(item => item.building_id === curr.building_id);

      if (!building) {
        // Jika gedung belum ada, tambahkan gedung baru
        building = {
          building_id: curr.building_id,
          building_name: curr.building_name,
          room_status: {
            available: {
              count: 0
            },
            not_available: {
              count: 0
            },
            booked: {
              count: 0
            }
          },
          rooms: [] // Tambahkan array rooms di luar room_status
        };
        acc.push(building);
      }

      // Tambahkan jumlah ruangan berdasarkan status
      if (building.room_status[curr.room_status]) {
        building.room_status[curr.room_status].count += curr.room_count;

        // Jika ada room_numbers, tambahkan ke array rooms
        if (curr.room_numbers) {
          const roomNumbers = curr.room_numbers.split(',');
          roomNumbers.forEach(room_number => {
            building.rooms.push({
              room_name: room_number,
              room_status: curr.room_status
            });
          });
        }
      }

      return acc;
    }, []);

    res.status(200).json({
      status: "success",
      message: "Data gedung dengan status ruangan berhasil diambil",
      data: groupedResults,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data gedung dengan status ruangan",
      error: err.message,
    });
  }
};



