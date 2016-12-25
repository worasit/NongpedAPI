const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
const chai = require('chai');
const customerTestData = require('../../data/customer');
const Customer = require('../../../app/models/customer');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);
mongoose.Promise = global.Promise;

describe('Customer Model', () => {
  before(() => mockgoose(mongoose).then(() => mongoose.connect('mongodb://localhost/testDb')));
  after(() => mongoose.connection.close());

  beforeEach(() => Customer.remove({}).exec());

  it('should save customer into database with a corrected customer information successfully', () => {
    // Arrange
    const customer = new Customer(customerTestData.CORRECTED_CUSTOMER_DATA);

    // Act
    const action = customer.save();

    // Assert
    return action
      .then((savedCustomer) => {
        expect(savedCustomer.user_name)
          .to.equal(customerTestData.CORRECTED_CUSTOMER_DATA.user_name);
      });
  });

  it('should not save customer into database if does not enter user_name', () => {
    // Arrange
    const customer = new Customer(customerTestData.UNCORRECTED_CUSTOMER_DATA_NO_USER_NAME);

    // Act
    const action = customer.save();

    // Assert
    return expect(action).to.eventually.be.rejectedWith('Customer validation failed');
  });
});

