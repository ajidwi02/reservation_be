const adminMiddleware = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ status: "error", message: "Unauthorized. Silakan login." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ status: "error", message: "Akses ditolak. Hanya admin yang dapat mengakses." });
  }

  next();
};

module.exports = adminMiddleware;
