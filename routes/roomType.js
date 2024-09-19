const express = require("express");
const router = express.Router();
const roomTypeController = require("../controllers/roomTypeController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

/**
 * @swagger
 * tags:
 *   name: RoomTypes
 *   description: API untuk mengelola room types
 */

/**
 * @swagger
 * /room-types:
 *   get:
 *     summary: Get all room types
 *     description: Retrieve a list of all room types.
 *     tags: [RoomTypes]
 *     responses:
 *       200:
 *         description: A list of room types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type_id:
 *                     type: integer
 *                     description: The room type ID.
 *                     example: 1
 *                   type_name:
 *                     type: string
 *                     description: The name of the room type.
 *                     example: 'Deluxe'
 *       404:
 *         description: No room types found
 */
router.get("/room-types", roomTypeController.getAllRoomTypes);

/**
 * @swagger
 * /room-types/{id}:
 *   get:
 *     summary: Get room type by ID
 *     description: Retrieve a single room type by its ID.
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room type ID
 *     responses:
 *       200:
 *         description: A room type object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type_id:
 *                   type: integer
 *                   description: The room type ID.
 *                   example: 1
 *                 type_name:
 *                   type: string
 *                   description: The name of the room type.
 *                   example: 'Deluxe'
 *       404:
 *         description: Room type not found
 */
router.get("/room-types/:id", roomTypeController.getRoomTypeById);

/**
 * @swagger
 * /room-types:
 *   post:
 *     summary: Create a new room type
 *     description: Create a new room type with the provided data.
 *     tags: [RoomTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *                 description: The name of the room type.
 *                 example: 'Suite'
 *     responses:
 *       201:
 *         description: Room type created successfully.
 *       400:
 *         description: Bad request, validation errors.
 */
router.post(
  "/room-types",
  authMiddleware,
  adminMiddleware,
  roomTypeController.createRoomType
);

/**
 * @swagger
 * /room-types/{id}:
 *   put:
 *     summary: Update a room type
 *     description: Update the details of a room type by its ID.
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_name:
 *                 type: string
 *                 description: The name of the room type.
 *                 example: 'Presidential Suite'
 *     responses:
 *       200:
 *         description: Room type updated successfully.
 *       404:
 *         description: Room type not found
 */
router.put(
  "/room-types/:id",
  authMiddleware,
  adminMiddleware,
  roomTypeController.updateRoomType
);

/**
 * @swagger
 * /room-types/{id}:
 *   delete:
 *     summary: Delete a room type
 *     description: Delete a room type by its ID.
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room type ID
 *     responses:
 *       200:
 *         description: Room type deleted successfully.
 *       404:
 *         description: Room type not found
 */
router.delete(
  "/room-types/:id",
  authMiddleware,
  adminMiddleware,
  roomTypeController.deleteRoomType
);

module.exports = router;
