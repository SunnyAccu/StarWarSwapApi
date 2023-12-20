const express = require('express');
const {
  insertStarshipData,
  getSingleStarship,
  getAllStarships,
  deleteStarship,
  updateStarship,
} = require('../controllers/starshipsController');
const router = express.Router();

// Route for inserting starship data
router.route('/starships/insert').post(insertStarshipData);

// Routes for fetching starships
router.route('/starships').get(getAllStarships);

// Routes for fetching, updating, and deleting a single starship
router
  .route('/starships/:id')
  .get(getSingleStarship)
  .delete(deleteStarship)
  .put(updateStarship);

module.exports = router;
