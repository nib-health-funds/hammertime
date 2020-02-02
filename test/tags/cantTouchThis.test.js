const cantTouchThis = require('../../src/tags/cantTouchThis.js');

describe('cantTouchThis()', () => {
  it('should return true when tag is cantTouchThis tag', () => {
    expect(cantTouchThis({ Key: 'hammertime:cantTouchThis' })).to.be.true;
  });

  it('should return false when tag is not cantTouchThis tag', () => {
    expect(cantTouchThis({ Key: 'hammertime:cantTouchThisBetween' })).to.be.false;
  });
});
