// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("reservation_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Koneksi ke database berhasil.");
  })
  .catch((err) => {
    console.error("Gagal terhubung ke database:", err);
  });

module.exports = sequelize;
