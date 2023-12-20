const express = require('express');
const {
  insertSpeciesData,
  getSingleSpecies,
  getAllSpecies,
  deleteSpecies,
  updateSpecies,
} = require('../controllers/speciesController');
const router = express.Router();

// Route for inserting species data
router.route('/species/insert').post(insertSpeciesData);

// Routes for fetching species
router.route('/species').get(getAllSpecies);

// Routes for fetching, updating, and deleting a single species
router
  .route('/species/:id')
  .get(getSingleSpecies)
  .delete(deleteSpecies)
  .put(updateSpecies);

module.exports = router;
