'use strict';

const Customer = require('../models/customer');

class CustomerController {
  static registerCustomer(req, res) {
    const customer = new Customer(req.body);
    return customer.save()
      .then(doc => res.status(200).json(doc))
      .catch(err => res.status(400).json(err));
  }
}

module.exports = CustomerController;
