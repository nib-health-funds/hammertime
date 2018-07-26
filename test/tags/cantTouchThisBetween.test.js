const cantTouchThisBetween = require('../../src/tags/cantTouchThisBetween');
const luxon = require('luxon');

const nowUTC = luxon.DateTime.utc();
const from = nowUTC.minus({ days: 18 });
const to = nowUTC.plus({ days: 10 });
const validDateRange = `${from.toFormat('yyyy-MM-dd')} and ${to.toFormat('yyyy-MM-dd')}`;
const malformedDateRange = `${from.toFormat('yyyy-MM-dd')} to ${to.toFormat('yyyy-MM-dd')}`;

describe('cantTouchThisBetween()', () => {
  it('should return false when tag is not a cantTouchThisBetween tag', () => {
    expect(cantTouchThisBetween({ Key: 'hammertime:cantTouchThis', Value: validDateRange })).to.be.false;
  });

  it('should return false when tag value is not a cantTouchThisBetween tag value', () => {
    expect(cantTouchThisBetween({ Key: 'hammertime:cantTouchThisBetween', Value: malformedDateRange })).to.be.false;
  });

  it('should return true when tag is cantTouchThisBetween and UTC now is between specified dates', () => {
    expect(cantTouchThisBetween({ Key: 'hammertime:cantTouchThisBetween', Value: validDateRange })).to.be.true;
  });

  it('should return false when tag is cantTouchThisBetween and UTC now is not between specified dates', () => {
    const invalidFrom = nowUTC.minus({ days: 10 });
    const invalidTo = nowUTC.minus({ days: 5 });
    expect(cantTouchThisBetween({ Key: 'hammertime:cantTouchThisBetween', Value: `${invalidFrom.toFormat('yyyy-MM-dd')} to ${invalidTo.toFormat('yyyy-MM-dd')}` })).to.be.false;
  });
});
