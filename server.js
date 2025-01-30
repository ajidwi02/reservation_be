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
const bookingDetailRoutes = require("./routes/bookingDetailRoutes");
const {
  Room,
  BookingRoom,
  Booking,
  BookingDetail,
  HistoryBookingRoom,
} = require("./models");
const { Op, Sequelize } = require("sequelize");
const cron = require("node-cron");

const app = express();

// Konfigurasi CORS
// app.use(cors({ origin: process.env.URL_CORS }));
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
app.use("/api", bookingDetailRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/admin", [authMiddleware, adminMiddleware], (req, res) => {
  res.json({ msg: "Ini halaman admin" });
});

const updateRoomStatus = async () => {
  console.log("Memperbarui status kamar berdasarkan kondisi...");

  try {
    const today = new Date().toISOString().split("T")[0];

    // Bagian kode yang sudah ada
    const bookings = await Booking.findAll({
      attributes: ["start_date"],
      group: ["start_date"],
    });

    let hasUpdated = false;

    for (const booking of bookings) {
      const date = booking.start_date.toISOString().split("T")[0];

      if (date === today) {
        // Perbarui status_id ke 3 untuk kamar dengan start_date hari ini
        await Room.update(
          { status_id: 3 },
          {
            where: {
              room_id: {
                [Op.in]: Sequelize.literal(`(SELECT bd.room_id 
                               FROM booking_detail bd
                               INNER JOIN booking_room brm ON bd.booking_room_id = brm.booking_room_id
                               INNER JOIN booking b ON brm.booking_id = b.booking_id 
                               WHERE DATE(b.start_date) = '${date}')`),
              },
            },
          }
        );
        hasUpdated = true;
      }
    }

    // Logika tambahan untuk kondisi room_id
    const todayBookings = await BookingDetail.findAll({
      include: [
        {
          model: BookingRoom,
          include: [
            {
              model: Booking,
              where: Sequelize.where(
                Sequelize.fn("DATE", Sequelize.col("start_date")),
                today
              ),
              attributes: ["start_date"],
            },
          ],
        },
        {
          model: Room,
          attributes: ["room_id"],
        },
      ],
    });

    for (const bookingDetail of todayBookings) {
      const roomId = bookingDetail.Room.room_id;

      // Kondisi khusus
      if (roomId === 88) {
        // Update status_id ke 2
        await Room.update(
          { status_id: 2 },
          { where: { room_id: { [Op.in]: [12, 13, 89] } } }
        );
        // Tambahan: Ubah status_id kamar terkait jadi 1 jika start_date hari ini
        await Room.update({ status_id: 1 }, { where: { room_id: 88 } });
      } else if ([12, 13].includes(roomId)) {
        await Room.update(
          { status_id: 2 },
          { where: { room_id: { [Op.in]: [88, 89] } } }
        );
        await Room.update(
          { status_id: 1 },
          { where: { room_id: { [Op.in]: [12, 13] } } }
        );
      } else if (roomId === 14) {
        await Room.update({ status_id: 2 }, { where: { room_id: 89 } });
        await Room.update({ status_id: 1 }, { where: { room_id: 14 } });
      } else if (roomId === 89) {
        await Room.update(
          { status_id: 2 },
          { where: { room_id: { [Op.in]: [12, 13, 14, 88] } } }
        );
        await Room.update({ status_id: 1 }, { where: { room_id: 89 } });
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
    console.error("Error saat update status ruangan:", error);
  }
};

const updateExpiredBookings = async () => {
  console.log(
    "Memperbarui status kamar untuk booking yang sudah kedaluwarsa..."
  );

  try {
    const today = new Date().toISOString().split("T")[0];

    // Ambil semua booking yang sudah kedaluwarsa
    const expiredBookings = await Booking.findAll({
      attributes: ["booking_id", "start_date", "end_date"],
      where: {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("DATE", Sequelize.col("end_date")),
            today
          ),
        ],
      },
      include: [
        {
          model: BookingRoom,
          include: [
            {
              model: BookingDetail,
              attributes: [
                "booking_room_id",
                "room_id",
                "days",
                "nomor_pesanan",
              ],
            },
          ],
        },
      ],
    });

    const expiredBookingIds = expiredBookings.map((b) => b.booking_id);

    // Ambil semua room_id yang terkait dengan booking yang sudah kedaluwarsa
    const expiredRoomIds = await BookingDetail.findAll({
      attributes: ["room_id"],
      include: [
        {
          model: BookingRoom,
          where: {
            booking_id: {
              [Op.in]: expiredBookingIds,
            },
          },
          required: true,
        },
      ],
    });

    const expiredRoomIdList = expiredRoomIds.map((r) => r.room_id);

    // Update status kamar yang sudah kedaluwarsa
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

    // Tambahkan riwayat ke HistoryBookingRoom sebelum menghapus data booking
    for (const booking of expiredBookings) {
      for (const bookingRoom of booking.BookingRooms) {
        for (const bookingDetail of bookingRoom.BookingDetails) {
          await HistoryBookingRoom.create({
            booking_room_id: bookingDetail.booking_room_id,
            room_id: bookingDetail.room_id,
            days: bookingDetail.days,
            nomor_pesanan: bookingDetail.nomor_pesanan,
            start_date: booking.start_date,
            end_date: booking.end_date,
            changed_at: new Date(),
          });
        }
      }
    }

    console.log("Riwayat booking berhasil ditambahkan ke HistoryBookingRoom.");

    // Hapus data dari tabel booking_room
    await BookingRoom.destroy({
      where: {
        booking_id: {
          [Op.in]: expiredBookingIds,
        },
      },
    });

    console.log("Data dari tabel booking_room berhasil dihapus.");

    // Hapus data dari tabel booking
    await Booking.destroy({
      where: {
        booking_id: {
          [Op.in]: expiredBookingIds,
        },
      },
    });

    console.log("Data dari tabel booking berhasil dihapus.");

    // Logika tambahan untuk kondisi room_id
    for (const roomId of expiredRoomIdList) {
      if (roomId === 88) {
        const activeRooms = await BookingDetail.count({
          where: { room_id: { [Op.in]: [12, 13] } },
        });

        // Jika tidak ada booking aktif untuk room_id 12 dan 13
        if (activeRooms === 0) {
          await Room.update(
            { status_id: 1 },
            { where: { room_id: { [Op.in]: [12, 13, 89] } } }
          );
        }
      } else if ([12, 13].includes(roomId)) {
        const activeRooms = await BookingDetail.count({
          where: { room_id: { [Op.in]: [12, 13] } },
        });

        // Jika tidak ada booking aktif untuk room_id 12 atau 13
        if (activeRooms === 0) {
          await Room.update(
            { status_id: 1 },
            { where: { room_id: { [Op.in]: [88, 89] } } }
          );
        }
      } else if (roomId === 14) {
        await Room.update({ status_id: 1 }, { where: { room_id: 89 } });
      } else if (roomId === 89) {
        const activeRooms = await BookingDetail.count({
          where: { room_id: { [Op.in]: [12, 13, 14, 88] } },
        });

        // Jika tidak ada booking aktif untuk room_id terkait
        if (activeRooms === 0) {
          await Room.update(
            { status_id: 1 },
            { where: { room_id: { [Op.in]: [12, 13, 14, 88] } } }
          );
        }
      }
    }
  } catch (error) {
    console.error("Error menghapus booking_room atau booking:", error);
  }
};

const checkAndUpdateMissedBookings = async () => {
  console.log("Memeriksa dan memperbarui status kamar yang terlewat...");

  try {
    const today = new Date().setUTCHours(0, 0, 0, 0);
    // const today = new Date().toISOString().split("T")[0];
    // Periksa dan perbarui kamar yang seharusnya mulai hari ini atau sebelumnya
    const missedBookings = await Booking.findAll({
      attributes: ["start_date", "booking_id"],
      where: {
        start_date: {
          [Op.lte]: new Date(),
        },
      },
      include: [
        {
          model: BookingRoom,
          include: [
            {
              model: BookingDetail,
              include: [
                {
                  model: Room,
                  attributes: ["room_id", "status_id"],
                  where: {
                    status_id: {
                      [Op.ne]: 3, // Tidak dalam status "booked"
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    for (const booking of missedBookings) {
      if (booking.start_date) {
        const date = booking.start_date.toISOString().split("T")[0];
        await Room.update(
          { status_id: 3 },
          {
            where: {
              room_id: {
                [Op.in]: Sequelize.literal(`(SELECT bd.room_id 
                               FROM booking_detail bd
                               INNER JOIN booking_room brm ON bd.booking_room_id = brm.booking_room_id
                               INNER JOIN booking b ON brm.booking_id = b.booking_id 
                               WHERE DATE(b.start_date) <= '${date}')`),
              },
            },
          }
        );
      }
    }

    // Logika tambahan untuk kondisi room_id
    const todayBookings = await BookingRoom.findAll({
      include: [
        {
          model: Booking,
          where: Sequelize.where(
            Sequelize.fn("DATE", Sequelize.col("start_date")),
            today
          ),
          attributes: ["start_date"],
        },
        {
          model: BookingDetail,
          include: [
            {
              model: Room,
              attributes: ["room_id"],
            },
          ],
        },
      ],
    });

    for (const bookingRoom of todayBookings) {
      for (const bookingDetail of bookingRoom.BookingDetails) {
        const roomId = bookingDetail.Room.room_id;

        // Kondisi khusus
        if (roomId === 88) {
          // Update status_id ke 2
          await Room.update(
            { status_id: 2 },
            { where: { room_id: { [Op.in]: [12, 13, 89] } } }
          );
          // Tambahan: Ubah status_id kamar terkait jadi 1 jika start_date hari ini
          await Room.update({ status_id: 1 }, { where: { room_id: 88 } });
        } else if ([12, 13].includes(roomId)) {
          await Room.update(
            { status_id: 2 },
            { where: { room_id: { [Op.in]: [88, 89] } } }
          );
          await Room.update(
            { status_id: 1 },
            { where: { room_id: { [Op.in]: [12, 13] } } }
          );
        } else if (roomId === 14) {
          await Room.update({ status_id: 2 }, { where: { room_id: 89 } });
          await Room.update({ status_id: 1 }, { where: { room_id: 14 } });
        } else if (roomId === 89) {
          await Room.update(
            { status_id: 2 },
            { where: { room_id: { [Op.in]: [12, 13, 14, 88] } } }
          );
          await Room.update({ status_id: 1 }, { where: { room_id: 89 } });
        }
      }
    }

    // Periksa dan perbarui kamar yang seharusnya berakhir sebelum hari ini (end_date < hari ini)
    const expiredBookings = await Booking.findAll({
      attributes: ["start_date", "end_date", "booking_id"],
      where: {
        end_date: {
          [Op.lt]: new Date(), // Gunakan Op.lt untuk memastikan hanya end_date yang sudah terlewati
        },
      },
      include: [
        {
          model: BookingRoom,
          include: [
            {
              model: BookingDetail,
              include: [
                {
                  model: Room,
                  where: {
                    status_id: {
                      [Op.eq]: 3, // Dalam status "booked"
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    for (const booking of expiredBookings) {
      if (booking.end_date && booking.booking_id) {
        const date = booking.end_date.toISOString().split("T")[0];
        await Room.update(
          { status_id: 1 },
          {
            where: {
              room_id: {
                [Op.in]: Sequelize.literal(`(SELECT bd.room_id 
                               FROM booking_detail bd
                               INNER JOIN booking_room brm ON bd.booking_room_id = brm.booking_room_id
                               INNER JOIN booking b ON brm.booking_id = b.booking_id 
                               WHERE DATE(b.end_date) <= '${date}')`),
              },
            },
          }
        );

        for (const booking of expiredBookings) {
          for (const bookingRoom of booking.BookingRooms) {
            for (const bookingDetail of bookingRoom.BookingDetails) {
              await HistoryBookingRoom.create({
                booking_room_id: bookingDetail.booking_room_id,
                room_id: bookingDetail.Room.room_id,
                days: bookingDetail.days,
                nomor_pesanan: bookingDetail.nomor_pesanan,
                start_date: booking.start_date,
                end_date: booking.end_date,
                changed_at: new Date(),
              });
            }
          }
        }

        // Hapus booking_room yang berkaitan
        await BookingRoom.destroy({
          where: {
            booking_room_id: {
              [Op.in]: booking.BookingRooms.map((br) => br.booking_room_id),
            },
          },
        });
        // Hapus booking yang berkaitan
        await Booking.destroy({ where: { booking_id: booking.booking_id } });

        // Tambahan: Perbarui status kamar terkait berdasarkan kondisi khusus
        const expiredRoomIdList = booking.BookingRooms.flatMap((br) =>
          br.BookingDetails.map((bd) => bd.Room.room_id)
        );

        for (const roomId of expiredRoomIdList) {
          if (roomId === 88) {
            const activeRooms = await BookingDetail.count({
              where: { room_id: { [Op.in]: [12, 13] } },
            });

            // Jika tidak ada booking aktif untuk room_id 12 dan 13
            if (activeRooms === 0) {
              await Room.update(
                { status_id: 1 },
                { where: { room_id: { [Op.in]: [12, 13, 89] } } }
              );
            }
          } else if ([12, 13].includes(roomId)) {
            const activeRooms = await BookingDetail.count({
              where: { room_id: { [Op.in]: [12, 13] } },
            });

            // Jika tidak ada booking aktif untuk room_id 12 atau 13
            if (activeRooms === 0) {
              await Room.update(
                { status_id: 1 },
                { where: { room_id: { [Op.in]: [88, 89] } } }
              );
            }
          } else if (roomId === 14) {
            await Room.update({ status_id: 1 }, { where: { room_id: 89 } });
          } else if (roomId === 89) {
            const activeRooms = await BookingDetail.count({
              where: { room_id: { [Op.in]: [12, 13, 14, 88] } },
            });

            // Jika tidak ada booking aktif untuk room_id terkait
            if (activeRooms === 0) {
              await Room.update(
                { status_id: 1 },
                { where: { room_id: { [Op.in]: [12, 13, 14, 88] } } }
              );
            }
          }
        }
      } else {
        console.error(
          "ID pemesanan atau tenggat tanggal tidak ada untuk pemesanan:",
          booking
        );
      }
    }

    console.log("Status kamar yang terlewat berhasil diperbarui.");
  } catch (error) {
    console.error(
      "Error memeriksa dan memperbarui status kamar yang terlewat:",
      error
    );
  }
};

// // Panggil fungsi saat server dimulai
checkAndUpdateMissedBookings();

// Menjalankan pada pukul 15:30
cron.schedule("30 16 * * *", () => {
  console.log("Menjalankan update booking yang sudah kedaluwarsa...");
  updateExpiredBookings();
});

// Menjalankan pada pukul 21:00
cron.schedule("0 18 * * *", () => {
  console.log("Menjalankan update booking yang sudah kedaluwarsa...");
  updateExpiredBookings();
});

// Menjalankan pada pukul 22:30
cron.schedule("30 22 * * *", () => {
  console.log("Menjalankan update booking yang sudah kedaluwarsa...");
  updateExpiredBookings();
});

// Jalankan fungsi setiap 4 jam
cron.schedule("0 */4 * * *", () => {
  console.log("Menjalankan update status kamar...");
  updateRoomStatus();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
