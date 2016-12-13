'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const customerTestData = require('../data/customer');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const mockgoose = require('mockgoose');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Routes', () => {

  let mockedApp;
  before(() =>
    mockgoose(mongoose)
      .then(() => mongoose.connect('mongodb://localhost/testDb'))
      .then(() => {
        mockedApp = require('../../app'); // eslint-disable-line global-require
      })
  );
  after(() => mongoose.connection.close());

  describe('#healthcheck', () => {
    it('should return 200 OK, if navigate to given path "/healthcheck"', () =>
      chai.request(mockedApp)
        .get('/healthcheck')
        .then(res => expect(res).to.have.status(200))
    );
  });

  describe('#customer', () => {
    it('should return 200 OK and save customer information, when registered customer', () =>
      chai.request(mockedApp)
        .post('/customers')
        .send(customerTestData.CORRECTED_CUSTOMER_DATA)
        .then(res => console.log(res.body))
    );

    it('should return 400 Bad Request and, when registered customer', () =>
      expect(chai.request(mockedApp)
        .post('/customers')
        .send(customerTestData.UNCORRECTED_CUSTOMER_DATA_NO_USER_NAME))
        .to.eventually.be.rejectedWith('Bad Request')
        .and.have.status(400)
    );
  });
});
