const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const customerTestData = require('../data/customer');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Routes', () => {
  describe('#healthcheck', () => {
    it('should return 200 OK, if navigate to given path "/healthcheck"', () =>
      chai.request(app)
        .get('/healthcheck')
        .then(res => expect(res).to.have.status(200))
    );
  });

  describe('#customer', () => {
    it('should return 200 OK and save customer information, when registered customer', () =>
      chai.request(app)
        .post('/customers')
        .send(customerTestData.CORRECTED_CUSTOMER_DATA)
        .then(res => expect(res).to.have.status(200))
    );

    it('should return 400 Bad Request and, when registered customer', () =>
      expect(chai.request(app)
        .post('/customers')
        .send(customerTestData.UNCORRECTED_CUSTOMER_DATA_NO_USER_NAME))
        .to.eventually.be.rejectedWith('Bad Request')
        .and.have.status(400)
    );
  });
});
