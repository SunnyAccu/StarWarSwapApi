const express = require('express');
const {
  insertFilmData,
  getSingleFilm,
  getAllFilms,
  deleteFilm,
  updateFilm,
} = require('../controllers/filmControllers');
const router = express.Router();

// Route for inserting film data
router.route('/films/insert').post(insertFilmData);

// Routes for fetching films
router.route('/films').get(getAllFilms);

// Routes for fetching, updating, and deleting a single film
router
  .route('/films/:id')
  .get(getSingleFilm)
  .delete(deleteFilm)
  .put(updateFilm);

module.exports = router;
