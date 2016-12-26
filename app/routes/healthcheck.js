const express = require('express');
const config = require('../../configManager');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(config);
});

module.exports = router;
