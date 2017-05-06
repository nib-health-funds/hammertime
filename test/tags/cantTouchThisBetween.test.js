const cantTouchThisBetween = require('../../src/tags/cantTouchThisBetween');
const moment = require('moment');

const nowUTC = moment().utc();
const from = nowUTC.clone().add(-10, 'days');
const to = nowUTC.clone().add(10, 'days');
const validDateRange = `${from.format('YYYY-MM-DD')} and ${to.format('YYYY-MM-DD')}`;
const malformedDateRange = `${from.format('YYYY-MM-DD')} to ${to.format('YYYY-MM-DD')}`;

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
    const invalidFrom = nowUTC.clone().add(-10, 'days');
    const invalidTo = nowUTC.clone().add(-5, 'days');
    expect(cantTouchThisBetween({ Key: 'hammertime:cantTouchThisBetween', Value: `${invalidFrom.format('YYYY-MM-DD')} to ${invalidTo.format('YYYY-MM-DD')}` })).to.be.false;
  });
});
