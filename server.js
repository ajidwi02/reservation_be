const express = require("express");
const bodyParser = require("body-parser");
const roomRoutes = require("./routes/room");

const app = express();

app.use(bodyParser.json());

app.use("/api", roomRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
