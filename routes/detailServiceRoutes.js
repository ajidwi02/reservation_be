const express = require('express');
const router = express.Router();
const detailServiceController = require('../controllers/detailServiceController');
const authMiddleware = require("../middleware/authMiddleware");

// Route untuk mengambil semua data
router.get('/detailService', detailServiceController.getAll);

// Route untuk mengambil data berdasarkan ID
router.get('/detailService/:id', detailServiceController.getById);

// Route untuk menambah data baru
router.post('/detailService', authMiddleware, detailServiceController.create);

// Route untuk mengupdate data berdasarkan ID
router.put('/detailService/:id', authMiddleware, detailServiceController.update);

// Route untuk menghapus data berdasarkan ID
router.delete('/detailService/:id', authMiddleware, detailServiceController.delete);

module.exports = router;
