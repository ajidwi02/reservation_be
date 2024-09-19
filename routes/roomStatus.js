const express = require("express");
const router = express.Router();
const roomStatusController = require("../controllers/roomStatusController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

/**
 * @swagger
 * tags:
 *   name: RoomStatuses
 *   description: API untuk mengelola room statuses
 */

/**
 * @swagger
 * /room-statuses:
 *   get:
 *     summary: Get all room statuses
 *     description: Retrieve a list of all room statuses.
 *     tags: [RoomStatuses]
 *     responses:
 *       200:
 *         description: A list of room statuses.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status_id:
 *                     type: integer
 *                     description: The room status ID.
 *                     example: 1
 *                   status_name:
 *                     type: string
 *                     description: The name of the room status.
 *                     example: 'Available'
 *       404:
 *         description: No room statuses found
 */
router.get("/room-statuses", roomStatusController.getAllRoomStatuses);

/**
 * @swagger
 * /room-statuses/{id}:
 *   get:
 *     summary: Get room status by ID
 *     description: Retrieve a single room status by its ID.
 *     tags: [RoomStatuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room status ID
 *     responses:
 *       200:
 *         description: A room status object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status_id:
 *                   type: integer
 *                   description: The room status ID.
 *                   example: 1
 *                 status_name:
 *                   type: string
 *                   description: The name of the room status.
 *                   example: 'Available'
 *       404:
 *         description: Room status not found
 */
router.get("/room-statuses/:id", roomStatusController.getRoomStatusById);

/**
 * @swagger
 * /room-statuses:
 *   post:
 *     summary: Create a new room status
 *     description: Create a new room status with the provided data.
 *     tags: [RoomStatuses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_name:
 *                 type: string
 *                 description: The name of the room status.
 *                 example: 'Occupied'
 *     responses:
 *       201:
 *         description: Room status created successfully.
 *       400:
 *         description: Bad request, validation errors.
 */
router.post(
  "/room-statuses",
  authMiddleware,
  adminMiddleware,
  roomStatusController.createRoomStatus
);

/**
 * @swagger
 * /room-statuses/{id}:
 *   put:
 *     summary: Update a room status
 *     description: Update the details of a room status by its ID.
 *     tags: [RoomStatuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room status ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status_name:
 *                 type: string
 *                 description: The name of the room status.
 *                 example: 'Under Maintenance'
 *     responses:
 *       200:
 *         description: Room status updated successfully.
 *       404:
 *         description: Room status not found
 */
router.put(
  "/room-statuses/:id",
  authMiddleware,
  adminMiddleware,
  roomStatusController.updateRoomStatus
);

/**
 * @swagger
 * /room-statuses/{id}:
 *   delete:
 *     summary: Delete a room status
 *     description: Delete a room status by its ID.
 *     tags: [RoomStatuses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room status ID
 *     responses:
 *       200:
 *         description: Room status deleted successfully.
 *       404:
 *         description: Room status not found
 */
router.delete(
  "/room-statuses/:id",
  authMiddleware,
  adminMiddleware,
  roomStatusController.deleteRoomStatus
);

module.exports = router;
