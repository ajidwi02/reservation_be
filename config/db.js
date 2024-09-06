const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("database_name", "username", "password", {
  host: "localhost",
  dialect: "mysql", // ganti dengan 'mysql' jika menggunakan MySQL
});

module.exports = sequelize;
