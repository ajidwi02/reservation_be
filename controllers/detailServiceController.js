const DetailService = require('../models/DetailService');

// GET: Ambil semua detail service
exports.getAll = async (req, res) => {
  try {
    const detailServices = await DetailService.findAll();
    res.status(200).json({
      status: 'sukses',
      message: 'Data berhasil diambil',
      data: detailServices
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data',
      error: error.message
    });
  }
};

// GET: Ambil detail service berdasarkan ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const detailService = await DetailService.findByPk(id);
    if (detailService) {
      res.status(200).json({
        status: 'sukses',
        message: 'Detail service ditemukan',
        data: detailService
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Detail service tidak ditemukan'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil data',
      error: error.message
    });
  }
};

// POST: Tambah detail service baru
exports.create = async (req, res) => {
  try {
    const { nama, deskripsi, harga, rating, foto, jumlah_kamar } = req.body;
    const newDetailService = await DetailService.create({ 
      nama, deskripsi, harga, rating, foto, jumlah_kamar 
    });
    res.status(201).json({
      status: 'sukses',
      message: 'Detail service berhasil dibuat',
      data: newDetailService
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal membuat data',
      error: error.message
    });
  }
};

// PUT: Update detail service berdasarkan ID
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, harga, rating, foto, jumlah_kamar } = req.body;
    const detailService = await DetailService.findByPk(id);
    
    if (detailService) {
      detailService.nama = nama;
      detailService.deskripsi = deskripsi;
      detailService.harga = harga;
      detailService.rating = rating;
      detailService.foto = foto;
      detailService.jumlah_kamar = jumlah_kamar;
      await detailService.save();
      res.status(200).json({
        status: 'sukses',
        message: 'Detail service berhasil diperbarui',
        data: detailService
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Detail service tidak ditemukan'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal memperbarui data',
      error: error.message
    });
  }
};

// DELETE: Hapus detail service berdasarkan ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const detailService = await DetailService.findByPk(id);
    
    if (detailService) {
      await detailService.destroy();
      res.status(200).json({
        status: 'sukses',
        message: 'Detail service berhasil dihapus'
      });
    } else {
      res.status(404).json({
        status: 'error',
        message: 'Detail service tidak ditemukan'
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus data',
      error: error.message
    });
  }
};
