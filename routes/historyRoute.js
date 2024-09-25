const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

// Mendapatkan semua riwayat booking room
router.get('/history', historyController.getAllHistory);

// Mendapatkan satu riwayat berdasarkan ID
router.get('/history/:id', historyController.getHistoryById);

// Menambahkan riwayat booking room baru
router.post('/history', historyController.createHistory);

// Menghapus riwayat berdasarkan ID
router.delete('/history/:id', historyController.deleteHistory);

module.exports = router;
