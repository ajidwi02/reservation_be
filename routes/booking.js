const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

/**
 * @swagger
 * tags:
 *    name: Bookings
 *    description: API untuk mengelola booking
 *
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieve a list of all bookings.
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: A list of bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: integer
 *                     description: The booking ID.
 *                     example: 1
 *                   room_number:
 *                     type: string
 *                     description: The room number.
 *                     example: '101'
 *                   days:
 *                     type: integer
 *                     description: Number of days booked.
 *                     example: 3
 */

router.get("/bookings", bookingController.getAllBookings);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     description: Retrieve a single booking by its ID.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: A booking object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 booking_id:
 *                   type: integer
 *                   description: The booking ID.
 *                   example: 1
 *                 room_number:
 *                   type: string
 *                   description: The room number.
 *                   example: '101'
 *                 days:
 *                   type: integer
 *                   description: Number of days booked.
 *                   example: 3
 *       404:
 *         description: Booking not found
 */

router.get("/bookings/:id", bookingController.getBookingById);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a new booking
 *     description: Create a new booking with the provided data.
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_number:
 *                 type: string
 *                 description: The room number.
 *                 example: '101'
 *               days:
 *                 type: integer
 *                 description: Number of days booked.
 *                 example: 3
 *     responses:
 *       201:
 *         description: Booking created successfully.
 */

router.post("/bookings", bookingController.createBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     description: Update the details of a booking by its ID.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_number:
 *                 type: string
 *                 description: The room number.
 *                 example: '101'
 *               days:
 *                 type: integer
 *                 description: Number of days booked.
 *                 example: 3
 *     responses:
 *       200:
 *         description: Booking updated successfully.
 *       404:
 *         description: Booking not found
 */

router.put("/bookings/:id", bookingController.updateBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     description: Delete a booking by its ID.
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking deleted successfully.
 *       404:
 *         description: Booking not found
 */

router.delete("/bookings/:id", bookingController.deleteBooking);

module.exports = router;
