const moment = require('moment');
const cantTouchThisBefore = require('../../src/tags/cantTouchThisBefore');

describe('cantTouchThisBefore()', () => {
  it('should return false when tag is not a cantTouchThisBefore tag', () => {
    const validDate = moment().utc();
    validDate.add(1, 'days');
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThis', Value: validDate.format('YYYY-MM-DD') })).to.be.false;
  });

  it('should return false when tag value is not a cantTouchThisBefore tag value', () => {
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThisBefore', Value: moment().utc().add(1, 'days').format('YYYY/MM/DD') })).to.be.false;
  });

  it('should return true when tag is cantTouchThisBefore and UTC now is before specified date', () => {
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThisBefore', Value: moment().utc().add(1, 'days').format('YYYY-MM-DD') })).to.be.true;
  });

  it('should return false when tag is cantTouchThisBefore and UTC now is not before specified date', () => {
    expect(cantTouchThisBefore({ Key: 'hammertime:cantTouchThisBefore', Value: moment().utc().add(-1, 'days').format('YYYY-MM-DD') })).to.be.false;
  });
});
