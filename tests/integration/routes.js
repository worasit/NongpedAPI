const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Routes', () => {
  describe('#healthcheck', () => {
    it('should return 200 OK, if navigate to given path "/healthcheck"', () =>
        chai.request(app)
            .get('/healthcheckx')
            .then(res => expect(res).to.have.status(200))
    );
  });
});
