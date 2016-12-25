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

  describe('#registerCustomer', () => {
    it('should return 200 OK with saving customer information, if given customer info is corrected', () => {
      // Arrange
      const request = httpMock.createRequest({
        method: 'POST',
        body: customerData.CORRECTED_CUSTOMER_DATA,
        json: true
      });
      const response = httpMock.createResponse();

      // Act
      const customerController = CustomerController.registerCustomer(request, response);

      // Assert
      return customerController.then(() => {
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
      const customerController = CustomerController.registerCustomer(request, response);

      // Assert
      return customerController.then(() => {
        expect(response.statusCode).to.equal(400);
        expect(JSON.parse(response._getData())).to.have.property('errors');
      });
    });
  });
  describe('#deleteCustomer', () => {
    it('should return 200 OK and delete customer information besed on given user_name', () => {
      // Arrange
      const request = httpMock.createRequest({
        method: 'DELETE',
        params: { user_name: customerData.CORRECTED_CUSTOMER_DATA.user_name }
      });
      const response = httpMock.createResponse();

      // Act
      const customerController = new CustomerModel(customerData.CORRECTED_CUSTOMER_DATA).save()
        .then(() => CustomerController.deleteCustomer(request, response));

      // Assert
      return customerController.then(() => {
        const actualResponse = JSON.parse(response._getData());
        expect(response.statusCode).to.equal(200);
        expect(actualResponse).to.equals('The customer test_user_name has been deleted.');
      });
    });

    it('should return 400 OK and did not delete customers, if given user_name does not exist.', () => {
      // Arrange
      const request = httpMock.createRequest({
        method: 'DELETE',
        params: { user_name: 'doesNotExistUser' }
      });
      const response = httpMock.createResponse();

      // Act
      const customerController = new CustomerModel(customerData.CORRECTED_CUSTOMER_DATA).save()
        .then(() => CustomerController.deleteCustomer(request, response));

      // Assert
      return customerController.then(() => {
        const actualResponse = JSON.parse(response._getData());
        expect(response.statusCode).to.equal(200);
        expect(actualResponse).to.equals('The customer doesNotExistUser does not exist.');
      });
    });
  });
  describe('#updateCustomer', () => {
    it('should return 200 OK and update customer information', () => {
      // Arrange
      const updatedCustomer = customerData.CORRECTED_CUSTOMER_DATA;
      updatedCustomer.address = 'updated address';
      const request = httpMock.createRequest({
        method: 'PUT',
        params: { user_name: customerData.CORRECTED_CUSTOMER_DATA.user_name },
        body: updatedCustomer
      });
      const response = httpMock.createResponse();

      // Act
      const customerController = new CustomerModel(customerData.CORRECTED_CUSTOMER_DATA).save()
        .then(() => CustomerController.updateCustomer(request, response));

      // Assert
      return customerController.then(() => {
        const actualResponse = JSON.parse(response._getData());
        expect(response.statusCode).to.equal(200);
        expect(actualResponse.address).to.equals('updated address');
      });
    });

    it('should return 200 OK and create a new customer if given customer does not exist.', () => {
      // Arrange
      const updatedCustomer = customerData.CORRECTED_CUSTOMER_DATA;
      updatedCustomer.address = 'new customer address';
      const request = httpMock.createRequest({
        method: 'PUT',
        params: { user_name: customerData.CORRECTED_CUSTOMER_DATA.user_name },
        body: updatedCustomer
      });
      const response = httpMock.createResponse();

      // Act
      const customerController = CustomerController.updateCustomer(request, response);

      // Assert
      return customerController.then(() => {
        const actualResponse = JSON.parse(response._getData());
        expect(response.statusCode).to.equal(200);
        expect(actualResponse.address).to.equals('new customer address');
      });
    });
  });
});
