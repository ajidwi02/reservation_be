const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ambil token dari header Authorization
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
    req.user = decoded; // Menyimpan data user ke dalam request object
    next(); // Lanjut ke endpoint berikutnya
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = authMiddleware;
