const express = require('express');
const {
  insertVehicleData,
  getSingleVehicle,
  getAllVehicles,
  deleteVehicle,
  updateVehicle,
} = require('../controllers/vehiclesController');
const router = express.Router();

// Route for inserting vehicle data
router.route('/vehicles/insert').post(insertVehicleData);

// Routes for fetching vehicles
router.route('/vehicles').get(getAllVehicles);

// Routes for fetching, updating, and deleting a single vehicle
router
  .route('/vehicles/:id')
  .get(getSingleVehicle)
  .delete(deleteVehicle)
  .put(updateVehicle);

module.exports = router;
