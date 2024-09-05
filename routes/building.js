const express = require("express");
const router = express.Router();
const buildingController = require("../controllers/buildingController");

router.get("/buildings", buildingController.getAllBuildings);
router.get("/buildings/:id", buildingController.getBuildingById);
router.post("/buildings", buildingController.createBuilding);
router.put("/buildings/:id", buildingController.updateBuilding);
router.delete("/buildings/:id", buildingController.deleteBuilding);

module.exports = router;
