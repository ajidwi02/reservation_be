const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API untuk mengelola ruangan
 */

/**
 * @swagger
 * /rooms/buildings/{id}:
 *   get:
 *     summary: Get all rooms by building ID
 *     description: Retrieve a list of all rooms within a building specified by building ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The building ID
 *     responses:
 *       200:
 *         description: A list of rooms in the building.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room_id:
 *                     type: integer
 *                     description: The room ID.
 *                     example: 1
 *                   room_number:
 *                     type: string
 *                     description: The room number.
 *                     example: '101'
 *                   building_id:
 *                     type: integer
 *                     description: The building ID.
 *                     example: 1
 *       404:
 *         description: Building not found
 */
router.get("/rooms/buildings/:id", roomController.getAllRoomsByBuildingId);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     description: Retrieve a single room by its ID.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room ID
 *     responses:
 *       200:
 *         description: A room object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room_id:
 *                   type: integer
 *                   description: The room ID.
 *                   example: 1
 *                 room_number:
 *                   type: string
 *                   description: The room number.
 *                   example: '101'
 *                 building_id:
 *                   type: integer
 *                   description: The building ID.
 *                   example: 1
 *       404:
 *         description: Room not found
 */
router.get("/rooms/:id", roomController.getRoomById);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     description: Add a new room with the provided data. Requires authentication and admin privileges.
 *     tags: [Rooms]
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
 *               building_id:
 *                 type: integer
 *                 description: The building ID where the room is located.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Room created successfully.
 *       403:
 *         description: Forbidden, requires authentication and admin privileges.
 */
router.post(
  "/rooms",
  authMiddleware,
  adminMiddleware,
  roomController.createRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room
 *     description: Update the details of a room by its ID. Requires authentication and admin privileges.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room ID
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
 *               building_id:
 *                 type: integer
 *                 description: The building ID where the room is located.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Room updated successfully.
 *       404:
 *         description: Room not found
 *       403:
 *         description: Forbidden, requires authentication and admin privileges.
 */
router.put(
  "/rooms/:id",
  authMiddleware,
  adminMiddleware,
  roomController.updateRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: Delete a room by its ID. Requires authentication and admin privileges.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully.
 *       404:
 *         description: Room not found
 *       403:
 *         description: Forbidden, requires authentication and admin privileges.
 */
router.delete(
  "/rooms/:id",
  authMiddleware,
  adminMiddleware,
  roomController.deleteRoom
);

module.exports = router;
