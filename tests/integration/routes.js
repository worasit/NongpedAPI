'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const customerTestData = require('../data/customer');
const chaiAsPromised = require('chai-as-promised');
const mongoose = require('mongoose');
const appWithMockedDB = require('../appWithMockedDB');
const CustomerModel = require('./../../app/models/customer');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Routes', () => {
  let mockedApp;
  before((done) => {
    appWithMockedDB.getMockedApp().then((app) => {
      mockedApp = app;
      done();
    });
  });
  after((done) => {
    mongoose.connection.close(done);
  });

  beforeEach(() => CustomerModel.remove({}).exec());

  describe('#healthcheck', () => {
    it('should return 200 OK, if navigate to given path "/healthcheck"', () =>
      chai.request(mockedApp)
        .get('/healthcheck')
        .then(res => expect(res).to.have.status(200))
    );
  });

  describe('#customer', () => {
    describe('#POST', () => {
      it('should return 200 OK and save customer information, when registered customer', () =>
        chai.request(mockedApp)
          .post('/customers')
          .send(customerTestData.CORRECTED_CUSTOMER_DATA)
          .then((res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.user_name).to.equal(customerTestData.CORRECTED_CUSTOMER_DATA.user_name);
          })
      );

      it('should return 400 Bad Request and, when registered customer', () =>
        expect(chai.request(mockedApp)
          .post('/customers')
          .send(customerTestData.UNCORRECTED_CUSTOMER_DATA_NO_USER_NAME))
          .to.eventually.be.rejectedWith('Bad Request')
          .and.have.status(400)
      );
    });
    describe('#DELETE', () => {
      it('should return 200 OK and delete customer information based on given customer id.', () => {
        // Arrange
        const arrange = new CustomerModel(customerTestData.CORRECTED_CUSTOMER_DATA).save();

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .delete(`/customers/${customerTestData.CORRECTED_CUSTOMER_DATA.user_name}`)
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.equal(`The customer ${customerTestData.CORRECTED_CUSTOMER_DATA.user_name} has been deleted.`);
          });
      });

      it('should return 400 OK and not delete if given customer id does not exist.', () => {
        // Arrange
        const arrange = new CustomerModel(customerTestData.CORRECTED_CUSTOMER_DATA).save();

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .delete('/customers/unknown')
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.equal('The customer unknown does not exist.');
          });
      });
    });
    describe('#PUT', () => {
      it('should return 200 OK and update or create a customer based on given customer\'s user_name', () => {
        // Arrange
        const arrange = new CustomerModel(customerTestData.CORRECTED_CUSTOMER_DATA).save();

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .put(`/customers/${customerTestData.CORRECTED_CUSTOMER_DATA.user_name}`)
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
          });
      });
    });
  });
})
;
