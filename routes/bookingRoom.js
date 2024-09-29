// routes/bookingRoomRoutes.js
const express = require("express");
const router = express.Router();
const bookingRoomController = require("../controllers/bookingRoomController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware

/**
 * @swagger
 * tags:
 *   name: BookingRooms
 *   description: API untuk mengelola booking rooms
 */

/**
 * @swagger
 * /booking-rooms:
 *   get:
 *     summary: Get all booking rooms
 *     description: Retrieve a list of all booking rooms.
 *     tags: [BookingRooms]
 *     responses:
 *       200:
 *         description: A list of booking rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_room_id:
 *                     type: integer
 *                     description: The booking room ID.
 *                     example: 1
 *                   booking_id:
 *                     type: integer
 *                     description: The ID of the booking.
 *                     example: 101
 *                   room_id:
 *                     type: integer
 *                     description: The ID of the room.
 *                     example: 202
 *       404:
 *         description: No booking rooms found
 */
router.get("/booking-rooms", bookingRoomController.getAllBookingRooms);

/**
 * @swagger
 * /booking-rooms/{id}:
 *   get:
 *     summary: Get booking room by ID
 *     description: Retrieve a single booking room by its ID.
 *     tags: [BookingRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The booking room ID
 *     responses:
 *       200:
 *         description: A booking room object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_room_id:
 *                   type: integer
 *                   description: The booking room ID.
 *                   example: 1
 *                 booking_id:
 *                   type: integer
 *                   description: The ID of the booking.
 *                   example: 101
 *                 room_id:
 *                   type: integer
 *                   description: The ID of the room.
 *                   example: 202
 *       404:
 *         description: Booking room not found
 */
router.get("/booking-rooms/:id", bookingRoomController.getBookingRoomById);
router.get("/booking-rooms/room/:id", bookingRoomController.getBookingRoomByRoomId); // Route baru ini
/**
 * @swagger
 * /booking-rooms:
 *   post:
 *     summary: Create a new booking room
 *     description: Create a new booking room with the provided data.
 *     tags: [BookingRooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 description: The ID of the booking.
 *                 example: 101
 *               room_id:
 *                 type: integer
 *                 description: The ID of the room.
 *                 example: 202
 *     responses:
 *       201:
 *         description: Booking room created successfully.
 *       400:
 *         description: Bad request, validation errors.
 */
router.post(
  "/booking-rooms",
  authMiddleware,
  bookingRoomController.createBookingRoom
);

/**
 * @swagger
 * /booking-rooms/{id}:
 *   put:
 *     summary: Update a booking room
 *     description: Update the details of a booking room by its ID.
 *     tags: [BookingRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The booking room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               booking_id:
 *                 type: integer
 *                 description: The ID of the booking.
 *                 example: 101
 *               room_id:
 *                 type: integer
 *                 description: The ID of the room.
 *                 example: 202
 *     responses:
 *       200:
 *         description: Booking room updated successfully.
 *       404:
 *         description: Booking room not found
 */
router.put(
  "/booking-rooms/:id",
  authMiddleware,
  bookingRoomController.updateBookingRoom
);

/**
 * @swagger
 * /booking-rooms/{id}:
 *   delete:
 *     summary: Delete a booking room
 *     description: Delete a booking room by its ID.
 *     tags: [BookingRooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The booking room ID
 *     responses:
 *       200:
 *         description: Booking room deleted successfully.
 *       404:
 *         description: Booking room not found
 */
router.delete(
  "/booking-rooms/:id",
  authMiddleware,
  bookingRoomController.deleteBookingRoom
);

module.exports = router;
