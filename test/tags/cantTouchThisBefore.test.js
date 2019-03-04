const luxon = require('luxon');
const cantTouchThisBefore = require('../../src/tags/cantTouchThisBefore');

describe('cantTouchThisBefore()', () => {
  it('should return false when tag is not a cantTouchThisBefore tag', () => {
    const validDate = luxon.DateTime.local().plus({ days: 1 }).toISODate();
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThis', Value: validDate })).to.be.false;
  });

  it('should return false when tag value is not a cantTouchThisBefore tag value', () => {
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThisBefore', Value: luxon.DateTime.local().plus({ days: 1 }).toFormat('yyyy/MM/dd') })).to.be.false;
  });

  it('should return true when tag is cantTouchThisBefore and UTC now is before specified date', () => {
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThisBefore', Value: luxon.DateTime.local().plus({ days: 5 }).toISODate() })).to.be.true;
  });

  it('should return false when tag is cantTouchThisBefore and UTC now is not before specified date', () => {
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThisBefore', Value: luxon.DateTime.local().minus({ days: 1 }).toISODate() })).to.be.false;
  });
});
