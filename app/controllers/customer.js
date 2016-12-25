'use strict';

const Customer = require('../models/customer');

class CustomerController {
  static registerCustomer(req, res) {
    const customer = new Customer(req.body);
    return customer.save()
      .then(doc => res.status(200).json(doc))
      .catch(err => res.status(400).json(err));
  }

  static deleteCustomer(req, res) {
    return Customer.findOneAndRemove({ user_name: req.params.user_name })
      .then((doc) => {
        if (doc) res.status(200).json(`The customer ${req.params.user_name} has been deleted.`);
        else res.status(200).json(`The customer ${req.params.user_name} does not exist.`);
      })
      .catch(err => res.status(400).json(err));
  }

  static updateCustomer(req, res) {
    return Customer.findOneAndUpdate({ user_name: req.params.user_name }, req.body, { upsert: true, new: true })
      .exec()
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(400).json(err)
      });
  }
}

module.exports = CustomerController;
