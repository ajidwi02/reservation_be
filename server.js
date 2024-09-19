require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors
const roomRoutes = require("./routes/room");
const buildingRoutes = require("./routes/building");
const bookingRoutes = require("./routes/booking");
const roomStatusRoutes = require("./routes/roomStatus");
const roomTypeRoutes = require("./routes/roomType");
const bookingRoomRoutes = require("./routes/bookingRoom");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoute");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");
const historyRoutes = require('./routes/historyRoute');
const app = express();
//swagger
const swaggerSetup = require("./swagger");
swaggerSetup(app);

// Konfigurasi CORS
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use(bodyParser.json());

app.use("/api", roomRoutes);
app.use("/api", buildingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", roomStatusRoutes);
app.use("/api", roomTypeRoutes);
app.use("/api", bookingRoomRoutes);
app.use("/api", userRoutes);
app.use('/api', historyRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/admin", [authMiddleware, adminMiddleware], (req, res) => {
  res.json({ msg: "Ini halaman admin" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
