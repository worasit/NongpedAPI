const express = require('express');
const CustomerController = require('../controllers/customer');

const router = express.Router();

router.post('/', CustomerController.registerCustomer);
router.put('/:user_name', CustomerController.updateCustomer);
router.delete('/:user_name', CustomerController.deleteCustomer);

module.exports = router;
