const Building = require("../models/building");

// Mendapatkan semua data gedung
exports.getAllBuildings = (req, res) => {
  // Memanggil metode getAll dari model Building
  Building.getAll((err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data gedung",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Data gedung berhasil diambil",
      data: results,
    });
  });
};

// Mendapatkan data gedung berdasarkan ID
exports.getBuildingById = (req, res) => {
  // Mendapatkan buildingId dari parameter URL
  const buildingId = req.params.id;

  // Memanggil metode getById dari model Building
  Building.getById(buildingId, (err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data gedung",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Data gedung berhasil diambil",
      data: results,
    });
  });
};

// Membuat gedung baru
exports.createBuilding = (req, res) => {
  // Mendapatkan nama gedung dari body request
  const { name } = req.body;

  // Memanggil metode create dari model Building
  Building.create(name, (err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal menambahkan gedung",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 201
    res.status(201).json({
      status: "success",
      message: "Gedung berhasil ditambahkan",
      data: results,
    });
  });
};

// Memperbarui data gedung
exports.updateBuilding = (req, res) => {
  // Mendapatkan buildingId dari parameter URL dan nama gedung dari body request
  const buildingId = req.params.id;
  const { name } = req.body;

  // Memanggil metode update dari model Building
  Building.update(buildingId, name, (err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal memperbarui gedung",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Gedung berhasil diperbarui",
      data: results,
    });
  });
};

// Menghapus gedung
exports.deleteBuilding = (req, res) => {
  // Mendapatkan buildingId dari parameter URL
  const buildingId = req.params.id;

  // Memanggil metode delete dari model Building
  Building.delete(buildingId, (err, results) => {
    if (err) {
      // Jika terjadi error, kirimkan respons error dengan status 500
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus gedung",
        error: err.message,
      });
    }
    // Jika berhasil, kirimkan respons sukses dengan status 200
    res.status(200).json({
      status: "success",
      message: "Gedung berhasil dihapus",
      data: results,
    });
  });
};
