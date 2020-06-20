const express = require('express');
const controller = require('../controllers/api-controller.js');

const router = express.Router();

router.get('/', controller.apiQueries, (req, res) => {
  console.log('saving final election data object for front end');
  console.log(res.locals.electionData);
  res.status(200).json(res.locals.electionData);
});

module.exports = router;
