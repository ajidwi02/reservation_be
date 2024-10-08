require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
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


const app = express();

app.use(bodyParser.json());

app.use("/api", roomRoutes);
app.use("/api", buildingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", roomStatusRoutes);
app.use("/api", roomTypeRoutes);
app.use("/api", bookingRoomRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/admin", [authMiddleware, adminMiddleware], (req, res) => {
  res.json({ msg: "Ini halaman admin" });
});

app.get("/api/user", authMiddleware, (req, res) => {
  res.json({ msg: "Ini halaman user" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
