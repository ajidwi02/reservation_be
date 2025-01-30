const BookingRoom = require("../models/bookingRoom");
const Booking = require("../models/booking");
const Room = require("../models/room");
const Building = require("../models/building");
const HistoryBookingRoom = require("../models/historyBR");
const BookingDetail = require("../models/bookingDetail");
// Mendapatkan semua booking rooms
const { Op, Sequelize } = require("sequelize");

exports.getAllBookingRooms = async (req, res) => {
  const { page = 1, limit = 6, buildingName } = req.query;

  const offset = (page - 1) * limit;

  let buildingFilter = {};
  if (buildingName) {
    buildingFilter = { name: buildingName };
  }

  try {
    const rows = await BookingRoom.findAll({
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"],
        },
        {
          model: BookingDetail,
          attributes: ["days"],
          include: [
            {
              model: Room,
              include: [
                {
                  model: Building,
                  attributes: ["name"],
                  where: buildingFilter,
                },
              ],
            },
          ],
        },
      ],
      order: [["booking_room_id", "DESC"]],
    });

    // Filter data yang memiliki buildingName
    const filteredResults = rows
      .map((bookingRoom) => {
        const roomNumbers = bookingRoom.BookingDetails.map(
          (detail) => detail.room_id
        ).length;
        return {
          bookingRoomId: bookingRoom.booking_room_id,
          startDate: bookingRoom.Booking.start_date,
          endDate: bookingRoom.Booking.end_date,
          days: bookingRoom.BookingDetails?.[0]?.days,
          buildingName: bookingRoom.BookingDetails[0]?.Room?.Building?.name,
          roomNumbers: roomNumbers,
        };
      })
      .filter((bookingRoom) => bookingRoom.buildingName);

    // Hitung total items setelah filter
    const count = filteredResults.length;

    // Pagination pada hasil yang sudah difilter
    const paginatedResults = filteredResults.slice(
      offset,
      offset + parseInt(limit)
    );

    if (paginatedResults.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Booking detail tidak ditemukan, tetapi pencarian berhasil",
        data: [], // Data kosong karena tidak ada hasil yang cocok
        totalItems: count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking rooms berhasil diambil",
      data: paginatedResults,
      totalItems: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking rooms",
      error: error.message,
    });
  }
};

// Mendapatkan booking room berdasarkan ID
exports.getBookingRoomById = async (req, res) => {
  const bookingRoomId = req.params.id;
  try {
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"], // Mengambil start_date dan end_date
        },
        {
          model: Room,
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"], // Include nama gedung
            },
          ],
        },
      ],
    });
    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil diambil",
      data: bookingRoom,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking room",
      error: error.message,
    });
  }
};

// Mendapatkan booking room berdasarkan room_id
exports.getBookingRoomByRoomId = async (req, res) => {
  const roomId = req.params.id;
  try {
    const bookingRooms = await BookingRoom.findAll({
      where: { room_id: roomId }, // Mendapatkan semua booking untuk room_id ini
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"],
        },
        {
          model: Room,
          attributes: ["room_number"],
          include: [
            {
              model: Building,
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    if (!bookingRooms || bookingRooms.length === 0) {
      return res.status(204).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Booking room berhasil diambil",
      data: bookingRooms, // Kirim semua booking
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil booking room",
      error: error.message,
    });
  }
};

// Mendapatkan tanggal yang sudah dipesan untuk ruangan tertentu
exports.getBookedDatesByRoomId = async (req, res) => {
  const roomId = req.params.id; // Mendapatkan room_id dari parameter
  try {
    // Query untuk mendapatkan tanggal booking berdasarkan room_id
    const bookings = await BookingRoom.findAll({
      include: [
        {
          model: Booking, // Relasi dengan tabel Booking
          attributes: ["start_date", "end_date"], // Hanya mengambil tanggal
        },
        {
          model: BookingDetail, // Relasi melalui BookingDetail
          where: { room_id: roomId }, // Filter berdasarkan room_id
          attributes: [], // Tidak mengambil kolom lain dari BookingDetail
        },
      ],
    });

    // Mengambil start_date dan end_date dari hasil query
    const bookedDates = bookings.map((booking) => {
      return {
        start_date: booking.Booking.start_date,
        end_date: booking.Booking.end_date,
      };
    });

    // Mengirimkan response
    res.status(200).json({
      status: "success",
      message: "Tanggal yang sudah dipesan berhasil diambil",
      data: bookedDates,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil tanggal yang sudah dipesan",
      error: error.message,
    });
  }
};

exports.getDatesByBookingRoomId = async (req, res) => {
  const bookingRoomId = req.params.id;

  try {
    // Langkah 1: Ambil booking_id dari booking_room_id
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"], // Ambil tanggal dari tabel Booking
        },
      ],
    });

    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Langkah 2: Cari semua room_id terkait booking_room_id di tabel BookingDetail
    const bookingDetails = await BookingDetail.findAll({
      where: { booking_room_id: bookingRoomId },
      attributes: ["room_id"], // Hanya ambil room_id
    });

    if (bookingDetails.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada room_id yang terkait dengan booking_room_id",
      });
    }

    // Ambil semua room_id dari hasil query
    const roomIds = bookingDetails.map((detail) => detail.room_id);

    // Langkah 3: Cari semua tanggal booking terkait room_id di tabel Booking
    const bookings = await BookingRoom.findAll({
      include: [
        {
          model: Booking,
          attributes: ["start_date", "end_date"], // Ambil tanggal dari tabel Booking
        },
        {
          model: BookingDetail,
          where: { room_id: roomIds }, // Filter dengan room_id
          attributes: [], // Tidak mengambil kolom lain dari BookingDetail
        },
      ],
    });

    // Langkah 4: Ambil start_date dan end_date dari hasil query
    const bookedDates = bookings.map((booking) => ({
      start_date: booking.Booking.start_date,
      end_date: booking.Booking.end_date,
    }));

    if (bookedDates.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada booking untuk room_id terkait",
      });
    }

    // Kirimkan response dengan seluruh tanggal yang ditemukan
    res.status(200).json({
      status: "success",
      message: "Tanggal booking berhasil diambil",
      data: bookedDates,
    });
  } catch (error) {
    console.error("Error saat mengambil tanggal booking:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil tanggal booking",
      error: error.message,
    });
  }
};

// Membuat booking room baru
// exports.createBookingRoom = async (req, res) => {
//   try {
//     const { room_id, start_date, end_date } = req.body;

//     // Validasi tanggal
//     if (!start_date || !end_date) {
//       return res.status(400).json({
//         status: "error",
//         message: "Start date dan End date tidak boleh kosong",
//       });
//     }

//     // Mengonversi tanggal ke objek Date
//     const startDate = new Date(start_date);
//     const endDate = new Date(end_date);

//     // Validasi apakah startDate lebih besar dari endDate
//     if (startDate > endDate) {
//       return res.status(400).json({
//         status: "error",
//         message: "Start date tidak boleh lebih besar dari End date",
//       });
//     }

//     // Set jam ke 08:00 untuk start date dan 16:00 untuk end date
//     startDate.setHours(8, 0, 0, 0); // Set jam lokal ke 08:00
//     endDate.setHours(16, 0, 0, 0); // Set jam lokal ke 16:00

//     // Validasi objek Date
//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//       return res.status(400).json({
//         status: "error",
//         message: "Tanggal tidak valid",
//       });
//     }

//     // Cek jika startDate kurang dari hari ini
//     const today = new Date();
//     today.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC

//     if (startDate < today) {
//       return res.status(400).json({
//         status: "error",
//         message: "Tidak bisa booking sebelum hari ini",
//       });
//     }

//     const existingBookingRoom = await BookingDetail.findOne({
//       where: {
//         room_id,
//       },
//       include: [
//         {
//           model: Booking,
//           where: {
//             [Op.or]: [
//               {
//                 start_date: {
//                   [Op.lte]: endDate,
//                 },
//                 end_date: {
//                   [Op.gte]: startDate,
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     });

//     if (existingBookingRoom) {
//       return res.status(400).json({
//         status: "error",
//         message: "Tanggal Sudah Dipesan",
//       });
//     }

//     // Hitung jumlah hari antara start_date dan end_date
//     const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

//     // Cek status kamar berdasarkan room_id
//     const room = await Room.findOne({
//       where: { room_id },
//       include: [{ model: Building, attributes: ["name"] }], // Pastikan Building dan nama diambil
//     });

//     if (!room) {
//       return res.status(404).json({
//         status: "error",
//         message: "Ruangan tidak ditemukan",
//       });
//     }

//     // Buat booking baru dengan start_date dan end_date
//     const booking = await Booking.create({
//       start_date: startDate,
//       end_date: endDate,
//     });
//     const booking_id = booking.booking_id;

//     const buildingMap = {
//       GedungA: "GAA",
//       GedungB: "GAB",
//       GedungC: "AC",
//     };

//     // Dapatkan building name sesuai dengan map, atau gunakan nama asli jika tidak ada di map
//     const buildingName =
//       buildingMap[room.Building.name.replace(/\s+/g, "")] ||
//       room.Building.name.replace(/\s+/g, "");

//     const roomNameMap = {
//       "R.Transit": "RT",
//       Lapangan: "L",
//       RRKecilA: "RRKA",
//       RRKecilB: "RRKB",
//       RRBesarC: "RRBC",
//       RRBesarAB: "RRBAB",
//     };

//     // console.log("Building Name:", buildingName);
//     const roomName =
//       roomNameMap[room.room_number.replace(/\s+/g, "")] ||
//       room.room_number.replace(/\s+/g, "");

//     // console.log("Building Name:", roomName);
//     // Ambil bagian hari, bulan, dan tahun dari startDate
//     const day = String(startDate.getDate()).padStart(2, "0"); // Pastikan memiliki dua digit
//     const month = String(startDate.getMonth() + 1).padStart(2, "0"); // Bulan mulai dari 0, jadi tambahkan 1
//     const year = startDate.getFullYear();

//     // Gabungkan menjadi format DDMMYYYY
//     const formattedDate = `${day}${month}${year}`;
//     const nomor_pesanan = `${buildingName}${roomName}${formattedDate}`;
//     // console.log("Generated nomor_pesanan:", nomor_pesanan);

//     // Buat booking room baru
//     const bookingRoom = await BookingRoom.create({
//       booking_id,
//       room_id,
//       days,
//       nomor_pesanan,
//     });

//     // Reset waktu startDate dan today ke awal hari
//     startDate.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC
//     const todayH = new Date();
//     todayH.setUTCHours(0, 0, 0, 0); // Reset jam ke awal hari dalam UTC

//     // Ubah status kamar menjadi booked (status_id = 3) jika start_date adalah hari ini
//     if (startDate.getTime() === todayH.getTime()) {
//       // Ubah status kamar yang dipesan menjadi booked (status_id = 3)
//       await Room.update({ status_id: 3 }, { where: { room_id } });

//       // Logika tambahan untuk kamar terkait
//       const relatedRooms = [];
//       if (room_id === 88) {
//         relatedRooms.push(...[12, 13, 89]);
//       } else if ([12, 13].includes(room_id)) {
//         relatedRooms.push(...[88, 89]);
//       } else if (room_id === 14) {
//         relatedRooms.push(89);
//       } else if (room_id === 89) {
//         relatedRooms.push(...[12, 13, 14, 88]);
//       }

//       // Perbarui status kamar terkait jika ada
//       if (relatedRooms.length > 0) {
//         await Room.update(
//           { status_id: 2 }, // Set status kamar terkait menjadi "dalam pemakaian" (status_id = 2)
//           { where: { room_id: { [Op.in]: relatedRooms } } }
//         );
//       }
//     }

//     // if (room_id === 88) {
//     //   await Room.update({ status_id: 2 }, { where: { room_id: [12, 13] } });
//     // } else if (room_id === 89) {
//     //   await Room.update({ status_id: 2 }, { where: { room_id: [12, 13, 88] } });
//     // }

//     // Tambahkan data ke tabel history_booking_rooms
//     await HistoryBookingRoom.create({
//       booking_room_id: bookingDetail.booking_room_id,
//       room_id: bookingDetail.room_id,
//       days: bookingDetail.days,
//       nomor_pesanan: bookingDetail.nomor_pesanan,
//       start_date: startDate,
//       end_date: endDate,
//       changed_at: new Date(),
//     });

//     res.status(201).json({
//       status: "success",
//       message:
//         "Booking room berhasil dibuat, riwayat dicatat, dan ruangan ter-booked",
//       data: bookingRoom,
//     });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({
//       status: "error",
//       message: "Gagal membuat booking room",
//       error: err.message,
//     });
//   }
// };

exports.createMultipleBookingRooms = async (req, res) => {
  try {
    const { rooms, start_date, end_date, start_time, end_time } = req.body;

    // Validasi input
    if (
      !start_date ||
      !end_date ||
      !start_time ||
      !end_time ||
      !rooms ||
      rooms.length === 0
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Start date, End date, Time start, Time end, dan rooms tidak boleh kosong",
      });
    }

    // Gabungkan tanggal dan waktu
    const startDateString = `${start_date}${start_time}`;
    const endDateString = `${end_date}${end_time}`;

    // Buat objek Date
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Validasi objek Date
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({
        status: "error",
        message: "Format tanggal atau waktu tidak valid",
      });
    }

    // Validasi startDate tidak boleh lebih besar dari endDate
    if (startDate >= endDate) {
      return res.status(400).json({
        status: "error",
        message:
          "Start date dan time tidak boleh lebih besar atau sama dengan End date dan time",
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (startDate < today) {
      return res.status(400).json({
        status: "error",
        message: "Tidak bisa booking sebelum hari ini",
      });
    }

    // Memeriksa semua booking yang ada untuk room tersebut
    for (const room_id of rooms) {
      console.log(`Memeriksa room_id: ${room_id} untuk tumpang tindih tanggal`);

      const existingBookings = await BookingDetail.findAll({
        where: { room_id },
        include: [
          {
            model: BookingRoom,
            include: [
              {
                model: Booking,
                where: {
                  [Op.and]: [
                    { start_date: { [Op.lt]: endDate } }, // Waktu mulai < waktu berakhir baru
                    { end_date: { [Op.gt]: startDate } }, // Waktu berakhir > waktu mulai baru
                  ],
                },
              },
            ],
          },
        ],
      });

      // Cek semua booking yang overlap
      const hasConflict = existingBookings.some(
        (bookingDetail) => bookingDetail.BookingRoom?.Booking
      );

      if (hasConflict) {
        console.log(`Conflict ditemukan untuk room_id: ${room_id}`);
        return res.status(400).json({
          status: "error",
          message: "Ruangan pada Tanggal atau Waktu Tertentu Sudah Dipesan",
        });
      }
    }

    // Buat booking baru setelah pengecekan
    const booking = await Booking.create({
      start_date: startDate,
      end_date: endDate,
    });
    const booking_id = booking.booking_id;

    // Buat satu entri di tabel booking_room dengan hanya booking_room_id dan booking_id
    const bookingRoom = await BookingRoom.create({
      booking_id,
    });
    const booking_room_id = bookingRoom.booking_room_id;

    // Memasukkan seluruh data ruang ke dalam tabel booking_detail
    for (const room_id of rooms) {
      const room = await Room.findOne({
        where: { room_id },
        include: [{ model: Building, attributes: ["name"] }],
      });

      if (!room) {
        return res.status(404).json({
          status: "error",
          message: `Ruangan dengan id ${room_id} tidak ditemukan`,
        });
      }

      const buildingMap = {
        GedungA: "GAA",
        GedungB: "GAB",
        GedungC: "AC",
      };

      const buildingName =
        buildingMap[room.Building.name.replace(/\s+/g, "")] ||
        room.Building.name.replace(/\s+/g, "");

      const roomNameMap = {
        "R.Transit": "RT",
        Lapangan: "L",
        RRKecilA: "RRKA",
        RRKecilB: "RRKB",
        RRBesarC: "RRBC",
        RRBesarAB: "RRBAB",
      };

      const roomName =
        roomNameMap[room.room_number.replace(/\s+/g, "")] ||
        room.room_number.replace(/\s+/g, "");

      const day = String(startDate.getDate()).padStart(2, "0");
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const year = startDate.getFullYear();

      const formattedDate = `${day}${month}${year}`;
      const nomor_pesanan = `${buildingName}${roomName}${formattedDate}`;

      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      const bookingDetail = await BookingDetail.create({
        booking_room_id,
        room_id,
        nomor_pesanan,
        days,
      });

      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);

      if (
        startDate.getUTCFullYear() === todayUTC.getUTCFullYear() &&
        startDate.getUTCMonth() === todayUTC.getUTCMonth() &&
        startDate.getUTCDate() === todayUTC.getUTCDate()
      ) {
        await Room.update({ status_id: 3 }, { where: { room_id } });

        const relatedRoomsMap = {
          88: [12, 13, 89],
          12: [88, 89],
          13: [88, 89],
          14: [89],
          89: [12, 13, 14, 88],
        };

        const relatedRooms = relatedRoomsMap[room_id] || [];

        if (relatedRooms.length > 0) {
          await Room.update(
            { status_id: 2 },
            { where: { room_id: { [Op.in]: relatedRooms } } }
          );
        }
      }
    }

    res.status(201).json({
      status: "success",
      message: "Booking rooms berhasil dibuat, dan ruangan ter-booked",
      data: {
        booking,
        bookingRoom,
      },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      status: "error",
      message: "Gagal membuat booking rooms",
      error: err.message,
    });
  }
};

exports.updateBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;
  const {
    start_date,
    end_date,
    start_time, // Format: "T11:00:00Z"
    end_time, // Format: "T13:00:00Z"
  } = req.body;

  // Gabungkan tanggal dan waktu menjadi string ISO
  const startDateStr = `${start_date}${start_time}`; // Contoh: "2025-01-29T11:00:00Z"
  const endDateStr = `${end_date}${end_time}`; // Contoh: "2025-02-01T13:00:00Z"

  // Validasi tanggal
  let startDate = new Date(startDateStr);
  let endDate = new Date(endDateStr);

  // Periksa apakah tanggal valid
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({
      status: "error",
      message: "Format tanggal atau waktu tidak valid",
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setel jam ke awal hari

  // Validasi jika bagian tanggal (tanpa waktu) kurang dari hari ini
  const startDateWithoutTime = new Date(startDate);
  startDateWithoutTime.setHours(0, 0, 0, 0);
  const endDateWithoutTime = new Date(endDate);
  endDateWithoutTime.setHours(0, 0, 0, 0);

  if (startDateWithoutTime < today || endDateWithoutTime < today) {
    return res.status(400).json({
      status: "error",
      message: "Tanggal tidak boleh kurang dari hari ini",
    });
  }

  // Validasi jika startDate lebih besar dari endDate
  if (startDate > endDate) {
    return res.status(400).json({
      status: "error",
      message: "Waktu mulai tidak boleh lebih besar dari waktu selesai",
    });
  }

  try {
    // [Bagian ini tetap sama seperti sebelumnya...]
    // Cari booking_id terkait booking_room_id
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
      include: [
        {
          model: Booking,
        },
        {
          model: BookingDetail,
          as: "bookingDetails",
          include: [
            {
              model: Room,
              include: [{ model: Building }],
            },
          ],
        },
      ],
    });

    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Hitung jumlah hari antara startDate dan endDate
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Update BookingDetail dengan days baru
    const [updatedBookingDetail] = await BookingDetail.update(
      { days },
      { where: { booking_room_id: bookingRoomId } }
    );

    // Update start_date dan end_date di Booking
    const [updatedBooking] = await Booking.update(
      { start_date: startDate, end_date: endDate },
      { where: { booking_id: bookingRoom.booking_id } }
    );

    // Variabel untuk menyimpan nomor pesanan
    let nomor_pesanan = "";

    // Update nomor_pesanan di setiap booking_detail
    for (let bookingDetail of bookingRoom.bookingDetails) {
      const room = bookingDetail.Room; // Ambil room terkait dengan bookingDetail

      if (!room || !room.Building) {
        return res.status(400).json({
          status: "error",
          message: "Room atau Building tidak ditemukan",
        });
      }

      const buildingMap = { GedungA: "GAA", GedungB: "GAB", GedungC: "AC" };
      const buildingName =
        buildingMap[room.Building.name.replace(/\s+/g, "")] ||
        room.Building.name.replace(/\s+/g, "");

      const roomNameMap = {
        "R.Transit": "RT",
        Lapangan: "L",
        RRKecilA: "RRKA",
        RRKecilB: "RRKB",
        RRBesarC: "RRBC",
        RRBesarAB: "RRBAB",
      };

      const roomName =
        room.room_number.replace(/\s+/g, "") in roomNameMap
          ? roomNameMap[room.room_number.replace(/\s+/g, "")]
          : room.room_number.replace(/\s+/g, "");

      const day = String(startDate.getDate()).padStart(2, "0");
      const month = String(startDate.getMonth() + 1).padStart(2, "0");
      const year = startDate.getFullYear();
      const formattedDate = `${day}${month}${year}`;

      // Membuat nomor pesanan yang unik berdasarkan roomName untuk setiap bookingDetail
      nomor_pesanan = `${buildingName}${roomName}${formattedDate}`;

      // Update nomor pesanan untuk setiap bookingDetail
      await BookingDetail.update(
        { nomor_pesanan },
        { where: { booking_detail_id: bookingDetail.booking_detail_id } }
      );
    }

    // Periksa jika ada yang diperbarui pada BookingDetail atau Booking
    if (updatedBookingDetail === 0 && updatedBooking === 0) {
      return res.status(404).json({
        status: "error",
        message: "Tidak ada perubahan yang dilakukan",
      });
    }

    // Update status_id di tabel room berdasarkan perbandingan startDate dengan today
    let newStatusId;
    if (new Date(start_date).setHours(0, 0, 0, 0) === today.getTime()) {
      newStatusId = 3; // Ganti status_id ke 3 jika start_date adalah hari ini
    } else {
      newStatusId = 1; // Ganti status_id ke 1 jika start_date bukan hari ini
    }

    // Update status_id di semua Room yang terkait dengan bookingDetails
    for (let bookingDetail of bookingRoom.bookingDetails) {
      const room = bookingDetail.Room;
      if (room) {
        await Room.update(
          { status_id: newStatusId },
          { where: { room_id: room.room_id } }
        );
      }
    }

    const activeRoomsMap = new Map();
    for (let bookingDetail of bookingRoom.bookingDetails) {
      const roomId = bookingDetail.Room.room_id;

      const isToday =
        new Date(start_date).setHours(0, 0, 0, 0) === today.getTime(); // Bandingkan berdasarkan timestamp

      let relatedRooms = [];

      // Menentukan room_id terkait
      if (roomId === 12) {
        relatedRooms = [88, 89];
      } else if (roomId === 13) {
        relatedRooms = [88, 89];
      } else if (roomId === 14) {
        relatedRooms = [89];
      } else if (roomId === 88) {
        relatedRooms = [12, 13, 89];
      } else if (roomId === 89) {
        relatedRooms = [12, 13, 14, 88];
      }

      // Tambahkan atau hapus room_id dari activeRooms
      for (let relatedRoom of relatedRooms) {
        const count = activeRoomsMap.get(relatedRoom) || 0;

        if (isToday) {
          // Jika hari ini, tambahkan room_id ke activeRooms
          activeRoomsMap.set(relatedRoom, count + 1);
        } else {
          // Jika bukan hari ini, hapus room_id dari activeRooms
          if (count > 0) {
            activeRoomsMap.set(relatedRoom, count - 1);
          }
        }
      }

      // Perbarui status_id untuk room_id terkait
      for (let relatedRoom of relatedRooms) {
        const activeCount = activeRoomsMap.get(relatedRoom) || 0;

        if (activeCount > 1) {
          // Jika ada lebih dari 1 pemesanan aktif, jangan ubah status ke 1
          await Room.update(
            { status_id: 2 },
            { where: { room_id: relatedRoom } }
          );
        } else if (activeCount === 1) {
          // Jika ada 1 pemesanan aktif, ubah status_id ke 2
          await Room.update(
            { status_id: 2 },
            { where: { room_id: relatedRoom } }
          );
        } else {
          // Jika tidak ada pemesanan aktif, ubah status_id ke 1
          await Room.update(
            { status_id: 1 },
            { where: { room_id: relatedRoom } }
          );
        }
      }
    }

    res.status(200).json({
      status: "success",
      message: "Booking room, tanggal, status kamar berhasil diperbarui",
    });
  } catch (error) {
    console.error("Error updating booking room:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui booking room",
      error: error.message,
    });
  }
};

// Menghapus booking room
exports.deleteBookingRoom = async (req, res) => {
  const bookingRoomId = req.params.id;

  try {
    // Cari booking_room yang ingin dihapus beserta bookingDetail
    const bookingRoom = await BookingRoom.findOne({
      where: { booking_room_id: bookingRoomId },
      include: [
        {
          model: BookingDetail,
          as: "bookingDetails",
        },
      ],
    });

    // Jika tidak ditemukan, kembalikan status 404
    if (!bookingRoom) {
      return res.status(404).json({
        status: "error",
        message: "Booking room tidak ditemukan",
      });
    }

    // Ambil booking_id dan room_id dari booking room
    const bookingId = bookingRoom.booking_id;
    const roomIds = bookingRoom.bookingDetails.map((detail) => detail.room_id);

    // Mendapatkan tanggal start_date dan end_date dalam satu query
    const booking = await Booking.findOne({
      attributes: ["start_date", "end_date"],
      where: { booking_id: bookingRoom.booking_id },
    });

    const startDate = new Date(booking.start_date).getTime();
    const endDate = new Date(booking.end_date).getTime();
    const today = new Date().getTime(); // Mendapatkan tanggal hari ini dalam format timestamp

    // Logika untuk memperbarui status kamar
    for (const roomId of roomIds) {
      const room = await Room.findOne({
        where: { room_id: roomId },
        attributes: ["status_id"],
      });

      const bookingDetail = bookingRoom.bookingDetails.find(
        (detail) => detail.room_id === roomId
      );

      // Periksa apakah bookingDetail valid
      if (!bookingDetail) {
        continue;
      }

      // Jika tanggal hari ini berada di antara start_date dan end_date, ubah status_id menjadi 1
      if (today >= startDate && today <= endDate) {
        await Room.update({ status_id: 1 }, { where: { room_id: roomId } });
      }
    }

    // Hapus booking room berdasarkan ID
    await BookingRoom.destroy({
      where: { booking_room_id: bookingRoomId },
    });

    // Memeriksa apakah ada booking room lain untuk booking_id yang sama
    const bookingRoomCount = await BookingRoom.count({
      where: { booking_id: bookingId },
    });

    // Jika tidak ada booking room yang tersisa, hapus booking
    if (bookingRoomCount === 0) {
      await Booking.destroy({
        where: { booking_id: bookingId },
      });
    }

    // Logika tambahan untuk kamar terkait
    const relatedRooms = new Set();

    if (roomIds.includes(88)) {
      relatedRooms.add(12).add(13).add(89);
    }
    if (roomIds.includes(14)) {
      relatedRooms.add(89);
    }
    if (roomIds.includes(89)) {
      relatedRooms.add(12).add(13).add(14).add(88);
    }
    if (roomIds.some((id) => [12, 13].includes(id))) {
      // Periksa apakah masih ada booking aktif untuk room_id 12 atau 13
      const activeBookingRooms = await BookingDetail.count({
        where: { room_id: { [Op.in]: [12, 13] } },
      });

      if (activeBookingRooms === 0) {
        relatedRooms.add(88).add(89);
      }
    }

    // Perbarui status kamar terkait jika diperlukan
    if (relatedRooms.size > 0) {
      if (today >= startDate && today <= endDate) {
        await Room.update(
          { status_id: 1 },
          { where: { room_id: { [Op.in]: Array.from(relatedRooms) } } }
        );
      }
    }

    // Mengembalikan respons sukses
    res.status(200).json({
      status: "success",
      message: "Booking room berhasil dihapus, status kamar diperbarui.",
    });
  } catch (error) {
    // Menangani kesalahan
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus booking room",
      error: error.message,
    });
  }
};
