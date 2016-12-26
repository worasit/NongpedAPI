'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const customerData = require('../data/customer');
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
          .send(customerData.CORRECTED_CUSTOMER_DATA)
          .then((res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.user_name).to.equal(customerData.CORRECTED_CUSTOMER_DATA.user_name);
          })
      );

      it('should return 400 Bad Request and, when registered customer', () =>
        expect(chai.request(mockedApp)
          .post('/customers')
          .send(customerData.UNCORRECTED_CUSTOMER_DATA_NO_USER_NAME))
          .to.eventually.be.rejectedWith('Bad Request')
          .and.have.status(400)
      );
    });
    describe('#DELETE', () => {
      it('should return 200 OK and delete customer information based on given customer id.', () => {
        // Arrange
        const arrange = new CustomerModel(customerData.CORRECTED_CUSTOMER_DATA).save();

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .delete(`/customers/${customerData.CORRECTED_CUSTOMER_DATA.user_name}`)
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.equal(`The customer ${customerData.CORRECTED_CUSTOMER_DATA.user_name} has been deleted.`);
          });
      });

      it('should return 400 OK and not delete if given customer id does not exist.', () => {
        // Arrange
        const arrange = new CustomerModel(customerData.CORRECTED_CUSTOMER_DATA).save();

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
        const arrange = new CustomerModel(customerData.CORRECTED_CUSTOMER_DATA).save();

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .put(`/customers/${customerData.CORRECTED_CUSTOMER_DATA.user_name}`)
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
          });
      });
    });

    describe('#GET', () => {
      it('should return 200 OK and all of customers information', () => {
        // Arrange
        const arrange = CustomerModel.create([
          customerData.CORRECTED_CUSTOMER_DATA,
          customerData.CORRECTED_CUSTOMER_DATA2]);

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .get('/customers')
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(2);
          });
      });
      it('should return 200 OK and a specific customer based on user_name', () => {
        // Arrange
        const arrange = CustomerModel.create([
          customerData.CORRECTED_CUSTOMER_DATA,
          customerData.CORRECTED_CUSTOMER_DATA2]);

        // Act
        const action = arrange.then(() =>
          chai.request(mockedApp)
            .get(`/customers/${customerData.CORRECTED_CUSTOMER_DATA2.user_name}`)
        );

        // Assert
        return action
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.email).to.equal(customerData.CORRECTED_CUSTOMER_DATA2.email);
          });
      });
    });
  });
})
;
