const express = require("express");
const router = express.Router();
const buildingController = require("../controllers/buildingController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authMiddleware
const adminMiddleware = require("../middleware/adminMiddleware"); // Import adminMiddleware

router.get("/buildings", buildingController.getAllBuildings);
router.get("/buildings/:id", buildingController.getBuildingById);
// Membuat building baru (memerlukan autentikasi dan admin)
router.post(
  "/buildings",
  authMiddleware,
  adminMiddleware,
  buildingController.createBuilding
);

// Memperbarui building (memerlukan autentikasi dan admin)
router.put(
  "/buildings/:id",
  authMiddleware,
  adminMiddleware,
  buildingController.updateBuilding
);

// Menghapus building (memerlukan autentikasi dan admin)
router.delete(
  "/buildings/:id",
  authMiddleware,
  adminMiddleware,
  buildingController.deleteBuilding
);

router.get("/buildingsMon", buildingController.getAllWithRoomStatus);

module.exports = router;
