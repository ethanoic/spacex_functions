const expect = require('chai').expect;

const f2 = require('../f2');

describe('Function 2 Tests', async () => {
  describe('Query starlink satelite launches', async () => {
    it('Year [2019] should have 120', async () => {
        let result = await f2.getAllStarlinkSatelites()
        let queryResult = f2.query(result, '2019//');
        expect(queryResult.length).to.equal(120)
    });
    it('Year Month [2019/11] should have 120', async () => {
        let result = await f2.getAllStarlinkSatelites()
        let queryResult = f2.query(result, '2019/11/');
        expect(queryResult.length).to.equal(60)
    });
    it('Year Month Date [2020/01/07] should have 60', async () => {
        let result = await f2.getAllStarlinkSatelites()
        let queryResult = f2.query(result, '2020/01/07');
        expect(queryResult.length).to.equal(60)
    });
    it('Year Month Date [2020/01/06] should have 0', async () => {
        let result = await f2.getAllStarlinkSatelites()
        let queryResult = f2.query(result, '2020/01/06');
        expect(queryResult.length).to.equal(0)
    });
  })

});