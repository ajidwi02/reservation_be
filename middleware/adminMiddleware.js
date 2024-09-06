// middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ status: "error", message: "Akses ditolak" });
  }
  next();
};

module.exports = adminMiddleware;
