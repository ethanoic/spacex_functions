const expect = require('chai').expect;

const f1 = require('../f1');

describe('Function 1 Tests', () => {
  describe('f1 get failed launches by launchpad id [5e9e4502f5090995de566f86]', () => {
    it('name should be [Kwajalein Atoll]', () => {
      let result = f1.get('5e9e4502f5090995de566f86');
      result.then((data) => {
        expect(data.launchpad).to.equal('Kwajalein Atoll')
      })
    });
    it('Total Failure count should be 3', () => {
      let result = f1.get('5e9e4502f5090995de566f86');
      result.then((data) => {
        expect(data.all_failures.length).to.equal(3)
      })
    })
  })
});
