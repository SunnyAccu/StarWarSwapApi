const express = require('express');
const {
  insertData,
  getSinglePerson,
  getAllPerson,
  deletePerson,
  updatePerson,
} = require('../controllers/personControllers');
const router = express.Router();
//  route for inserting person data

router.route('/people/insert').post(insertData);
router.route('/people').get(getAllPerson);
router
  .route('/people/:id')
  .get(getSinglePerson)
  .delete(deletePerson)
  .put(updatePerson);

module.exports = router;
