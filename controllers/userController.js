const User = require('../models/user');
const bcrypt = require('bcrypt');
// Mendapatkan semua pengguna
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "success",
      message: "Pengguna berhasil diambil",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil pengguna",
      error: error.message
    });
  }
};

// Mendapatkan pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Pengguna berhasil diambil",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil pengguna",
      error: error.message
    });
  }
};

// Memperbarui pengguna
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, role } = req.body;
  
    try {
      let updatedFields = { username, email, role };
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedFields.password = hashedPassword;
      }
  
      const [updated] = await User.update(updatedFields, {
        where: { user_id: userId }
      });
  
      if (updated === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Pengguna tidak ditemukan'
        });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Pengguna berhasil diperbarui'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Gagal memperbarui pengguna',
        error: error.message
      });
    }
  };

// Menghapus pengguna
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleted = await User.destroy({
      where: { user_id: userId }
    });
    if (deleted === 0) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Pengguna berhasil dihapus"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus pengguna",
      error: error.message
    });
  }
};
