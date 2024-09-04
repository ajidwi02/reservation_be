const Room = require("../models/room");

exports.getAllRooms = (req, res) => {
  Room.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve rooms",
        error: err.message,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Rooms retrieved successfully",
      data: results,
    });
  });
};
