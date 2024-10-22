require("dotenv").config(); // Memuat .env file

const express = require("express");
const DetailService = require("../models/DetailService");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Import fs untuk fs.existsSync
const fsPromises = require("fs").promises; // Import fs/promises untuk operasi berbasis promises

const app = express();
const BASE_URL = process.env.BASE_URL;

console.log("BASE_URL:", BASE_URL); // Debugging untuk memeriksa BASE_URL

const uploadPath = path.join(__dirname, "../uploads/foto/");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Konfigurasi multer untuk menyimpan foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${timestamp}${fileExtension}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

// Fungsi untuk menghapus file
const deleteFile = async (filePath) => {
  try {
    await fsPromises.unlink(filePath);
    console.log("File berhasil dihapus:", filePath);
  } catch (err) {
    console.error("Gagal menghapus file:", err);
  }
};

// GET: Ambil semua detail service
exports.getAll = async (req, res) => {
  try {
    const detailServices = await DetailService.findAll();
    res.status(200).json({
      status: "sukses",
      message: "Data berhasil diambil",
      data: detailServices,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data",
      error: error.message,
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
        status: "sukses",
        message: "Detail service ditemukan",
        data: detailService,
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Detail service tidak ditemukan",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data",
      error: error.message,
    });
  }
};

// POST: Tambah detail service baru dengan foto
exports.create = [
  upload.single("foto"),
  async (req, res) => {
    try {
      const { nama, deskripsi, harga, rating, jumlah_kamar } = req.body;
      const foto = req.file
        ? `${BASE_URL}/uploads/foto/${req.file.filename}`
        : null;

      const newDetailService = await DetailService.create({
        nama,
        deskripsi,
        harga,
        rating,
        foto,
        jumlah_kamar,
      });
      res.status(201).json({
        status: "sukses",
        message: "Detail service berhasil dibuat",
        data: newDetailService,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal membuat data",
        error: error.message,
      });
    }
  },
];

exports.update = [
  upload.single("foto"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, deskripsi, harga, rating, jumlah_kamar } = req.body;
      const detailService = await DetailService.findByPk(id);

      if (detailService) {
        // Pastikan foto lama ada dan bukan direktori
        if (req.file) {
          const oldPhotoFileName = detailService.foto.split("/").pop();
          const oldPhotoPath = path.join(uploadPath, oldPhotoFileName);

          // Cek apakah file lama ada sebelum mencoba menghapusnya
          if (fs.existsSync(oldPhotoPath)) {
            await deleteFile(oldPhotoPath);
            // Update foto dengan foto baru
            detailService.foto = `${BASE_URL}/uploads/foto/${req.file.filename}`;
          } else {
            console.warn(
              `File lama tidak ditemukan untuk dihapus: ${oldPhotoPath}`
            );
          }
        } else {
          console.log(
            "Tidak ada file baru yang diunggah, foto lama tetap digunakan."
          );
        }

        // Simpan perubahan detail service
        await detailService.save();
        res.status(200).json({
          status: "sukses",
          message: "Detail service berhasil diperbarui",
          data: detailService,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Detail service tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Gagal memperbarui data:", error); // Log kesalahan
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui data",
        error: error.message,
      });
    }
  },
];

// DELETE: Hapus detail service berdasarkan ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const detailService = await DetailService.findByPk(id);

    if (detailService) {
      // Hapus file gambar terkait jika ada
      const oldPhotoFileName = detailService.foto.split("/").pop();
      const oldPhotoPath = path.join(uploadPath, oldPhotoFileName);
      await deleteFile(oldPhotoPath); // Hapus file foto jika ada

      await detailService.destroy();
      res.status(200).json({
        status: "sukses",
        message: "Detail service berhasil dihapus",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Detail service tidak ditemukan",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus data",
      error: error.message,
    });
  }
};
