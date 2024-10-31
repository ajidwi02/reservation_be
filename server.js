require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
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
const historyRoutes = require("./routes/historyRoute");
const detailServiceRoutes = require("./routes/detailServiceRoutes");
const { Room, BookingRoom, Booking } = require("./models");
const { Op, Sequelize } = require("sequelize");
const cron = require("node-cron");

const app = express();

// Konfigurasi CORS
app.use(cors({ origin: "http://localhost:3001" }));
app.use(bodyParser.json());

// Menambahkan middleware untuk parsing URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk folder statis 'uploads' agar bisa diakses secara publik
app.use("/uploads/foto", express.static(path.join(__dirname, "uploads/foto")));

app.use("/api", roomRoutes);
app.use("/api", buildingRoutes);
app.use("/api", bookingRoutes);
app.use("/api", roomStatusRoutes);
app.use("/api", roomTypeRoutes);
app.use("/api", bookingRoomRoutes);
app.use("/api", userRoutes);
app.use("/api", historyRoutes);
app.use("/api", detailServiceRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/admin", [authMiddleware, adminMiddleware], (req, res) => {
  res.json({ msg: "Ini halaman admin" });
});

// Fungsi untuk memperbarui status kamar
const updateRoomStatus = async () => {
  console.log("Memperbarui status kamar...");

  try {
    const bookings = await Booking.findAll({
      attributes: ["start_date"],
      group: ["start_date"],
    });

    let hasUpdated = false;

    for (const booking of bookings) {
      const date = booking.start_date.toISOString().split("T")[0];

      const today = new Date().toISOString().split("T")[0];

      if (date === today) {
        await Room.update(
          { status_id: 3 },
          {
            where: {
              room_id: {
                [Op.in]: Sequelize.literal(`(SELECT br.room_id 
                               FROM booking_room br
                               INNER JOIN booking b ON br.booking_id = b.booking_id 
                               WHERE DATE(b.start_date) = '${date}')`),
              },
            },
          }
        );
        hasUpdated = true;
      }
    }

    if (!hasUpdated) {
      console.log(
        "Tidak ada kamar yang perlu diperbarui karena start_date bukan hari ini."
      );
    } else {
      console.log("Status kamar berhasil diperbarui.");
    }
  } catch (error) {
    console.error("Error updating room status:", error);
  }
};

// Fungsi untuk menghapus booking_room dan mengubah status_id ke 1
const updateExpiredBookings = async () => {
  console.log(
    "Memperbarui status kamar untuk booking yang sudah kedaluwarsa..."
  );

  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const expiredBookings = await Booking.findAll({
      attributes: ["booking_id"],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("DATE", Sequelize.col("end_date")),
            todayString
          ),
        ],
      },
    });

    const expiredBookingIds = expiredBookings.map((b) => b.booking_id);

    const expiredRoomIds = await BookingRoom.findAll({
      attributes: ["room_id"],
      where: {
        booking_id: {
          [Op.in]: expiredBookingIds,
        },
      },
    });

    const expiredRoomIdList = expiredRoomIds.map((r) => r.room_id);

    if (expiredRoomIdList.length > 0) {
      await Room.update(
        { status_id: 1 },
        {
          where: {
            room_id: {
              [Op.in]: expiredRoomIdList,
            },
          },
        }
      );

      console.log(
        "Status kamar berhasil diperbarui untuk booking yang sudah kedaluwarsa."
      );
    } else {
      console.log("Tidak ada kamar yang perlu diperbarui.");
    }

    await BookingRoom.destroy({
      where: {
        booking_id: {
          [Op.in]: expiredBookingIds,
        },
      },
    });

    console.log("Data dari tabel booking_room berhasil dihapus.");

    await Booking.destroy({
      where: {
        booking_id: {
          [Op.in]: expiredBookingIds,
        },
      },
    });

    console.log("Data dari tabel booking berhasil dihapus.");
  } catch (error) {
    console.error("Error menghapus booking_room atau booking:", error);
  }
};

// Menjalankan pada pukul 17:00
cron.schedule("30 15 * * *", () => {
  console.log("Menjalankan update booking yang sudah kedaluwarsa...");
  updateExpiredBookings();
});

// Menjalankan pada pukul 21:00
cron.schedule("0 18 * * *", () => {
  console.log("Menjalankan update booking yang sudah kedaluwarsa...");
  updateExpiredBookings();
});

// Menjalankan pada pukul 23:30
cron.schedule("30 22 * * *", () => {
  console.log("Menjalankan update booking yang sudah kedaluwarsa...");
  updateExpiredBookings();
});

// Jalankan fungsi setiap 8 jam
cron.schedule("0 */4 * * *", () => {
  console.log("Menjalankan update status kamar...");
  updateRoomStatus();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
