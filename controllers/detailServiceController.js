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

const upload = multer({ storage: storage }).array("foto", 6); // Mengizinkan hingga 3 file

// Fungsi untuk menghapus file
const deleteFile = async (filePath) => {
  try {
    await fsPromises.unlink(filePath);
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
// POST: Add new detail service with photos
exports.create = [
  upload, // multer handles file uploads
  async (req, res) => {
    try {
      const { nama, deskripsi, harga, rating, jumlah_kamar } = req.body;
      const fotos = req.files.map(
        (file) => `${BASE_URL}/uploads/foto/${file.filename}`
      ); // Create URLs for each uploaded photo

      const newDetailService = await DetailService.create({
        nama,
        deskripsi,
        harga,
        rating,
        foto: fotos, // Store as an array
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

// PUT: Update detail service
exports.update = [
  upload, // Handle multiple file uploads
  async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, deskripsi, harga, rating, jumlah_kamar } = req.body;

      // Cari detail service berdasarkan ID
      const detailService = await DetailService.findByPk(id);

      if (detailService) {
        // Ambil foto lama dari database (mungkin dalam format string JSON)
        let oldPhotos = Array.isArray(detailService.foto)
          ? detailService.foto // Jika sudah array, tidak perlu parsing
          : JSON.parse(detailService.foto); // Jika berupa string JSON, parsing ke array

        // Jika tidak ada foto lama (oldPhotos kosong), kita akan upload foto baru
        if (!oldPhotos || oldPhotos.length === 0) {
          oldPhotos = []; // Pastikan oldPhotos tetap kosong jika tidak ada foto lama
        }

        // 1. Hapus foto lama dari local storage (hapus yang sesuai dengan nama)
        // Hanya hapus foto lama jika ada foto baru
        if (req.files && req.files.length > 0) {
          for (const oldPhoto of oldPhotos) {
            // Ambil nama file dari URL (hanya nama file saja)
            const oldPhotoFileName = oldPhoto.split("/").pop(); // Ambil nama file setelah /
            const oldPhotoPath = path.join(uploadPath, oldPhotoFileName); // Gabungkan dengan path lokal

            // Periksa apakah file lama masih ada dan perlu dihapus
            if (fs.existsSync(oldPhotoPath)) {
              await deleteFile(oldPhotoPath); // Pastikan penghapusan file berhasil
            } else {
              console.log(
                "File lama tidak ditemukan, tidak dapat dihapus:",
                oldPhotoPath
              );
            }
          }
        }

        // 2. Jika ada file baru yang diunggah
        if (req.files && req.files.length > 0) {
          // Map file baru ke URL
          const newPhotos = req.files.map(
            (file) => `${BASE_URL}/uploads/foto/${file.filename}`
          );

          // Ganti foto lama dengan foto baru
          detailService.foto = newPhotos;
        }
        // Jika tidak ada foto baru, pertahankan foto lama
        else {
          detailService.foto = oldPhotos; // Tidak mengubah foto jika tidak ada file baru
        }

        // 3. Update field lain
        detailService.nama = nama;
        detailService.deskripsi = deskripsi;
        detailService.harga = harga;
        detailService.rating = rating;
        detailService.jumlah_kamar = jumlah_kamar;

        // Simpan perubahan di database
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
      console.error("Gagal memperbarui data:", error);
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
