const express = require("express");
const bodyParser = require("body-parser");
const roomRoutes = require("./routes/room");
const buildingRoutes = require("./routes/building");
const bookingRoutes = require("./routes/booking");
const roomStatusRoutes = require("./routes/roomStatus");
const roomTypeRoutes = require("./routes/roomType");
const bookingRoomRoutes = require("./routes/bookingRoom");

const app = express();

app.use(bodyParser.json());

app.use("/api", roomRoutes);
app.use("/api", buildingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", roomStatusRoutes);
app.use("/api", roomTypeRoutes);
app.use("/api", bookingRoomRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
