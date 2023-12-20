const express = require('express');
const {
  insertPlanetData,
  getSinglePlanet,
  getAllPlanets,
  deletePlanet,
  updatePlanet,
} = require('../controllers/planetControllers');
const router = express.Router();

// Route for inserting planet data
router.route('/planets/insert').post(insertPlanetData);

// Routes for fetching planets
router.route('/planets').get(getAllPlanets);

// Routes for fetching, updating, and deleting a single planet
router
  .route('/planets/:id')
  .get(getSinglePlanet)
  .delete(deletePlanet)
  .put(updatePlanet);

module.exports = router;
