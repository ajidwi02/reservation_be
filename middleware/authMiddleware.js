// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Mengambil token setelah "Bearer"

  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "Tidak ada token, otorisasi ditolak" });
  }

  jwt.verify(token, "YOUR_SECRET_KEY", (err, decoded) => {
    // Ganti dengan kunci rahasia Anda
    if (err) {
      return res
        .status(401)
        .json({ status: "error", message: "Token tidak valid" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;
