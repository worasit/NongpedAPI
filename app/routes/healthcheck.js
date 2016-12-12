const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json('The NongPed API is now running healthy.');
});

module.exports = router;
