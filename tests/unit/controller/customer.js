'use strict';

const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const expect = require('chai').expect;
const customerData = require('../../data/customer');
const httpMock = require('node-mocks-http');
const CustomerController = require('./../../../app/controllers/customer');
const CustomerModel = require('./../../../app/models/customer');

describe('Customer Controller', () => {
  before(() => mockgoose(mongoose).then(() => mongoose.connect('mongodb://localhost/test')));
  after(() => mongoose.connection.close());

  beforeEach(() => CustomerModel.remove({}).exec());

  it('should return 200 OK with saving customer information, if given customer info is corrected', () => {
    // Arrange
    const request = httpMock.createRequest({
      method: 'POST',
      body: customerData.CORRECTED_CUSTOMER_DATA,
      json: true
    });
    const response = httpMock.createResponse();

    // Act
    const customer = CustomerController.registerCustomer(request, response);

    // Assert
    return customer.then(() => {
      const actualResponse = JSON.parse(response._getData());
      expect(response.statusCode).to.equal(200);
      expect(actualResponse.email).to.equals(customerData.CORRECTED_CUSTOMER_DATA.email);
    });
  });

  it('should return 400 OK with saving customer information, if given customer info is uncorrected', () => {
    // Arrange
    const request = httpMock.createRequest({
      method: 'POST',
      body: customerData.UNCORRECTED_CUSTOMER_DATA_NO_USER_NAME,
      json: true
    });
    const response = httpMock.createResponse();

    // Act
    const customer = CustomerController.registerCustomer(request, response);

    // Assert
    return customer.then(() => {
      expect(response.statusCode).to.equal(400);
      expect(JSON.parse(response._getData())).to.have.property('errors');
    });
  });
});
