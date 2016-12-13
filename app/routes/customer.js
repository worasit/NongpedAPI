const express = require('express');
const CustomerController = require('../controllers/customer');

const router = express.Router();

router.post('/', CustomerController.registerCustomer);

module.exports = router;
