const canITouchThis = require('../../src/tags/canITouchThis');
const moment = require('moment');

describe('canITouchThis()', () => {
  it('should return true if every tag check returns false', () => {
    const tags = [
      {
        Key: 'hammertime:cantTouchThisBefore',
        Value: moment.utc().add(-2, 'days').format('YYYY-MM-DD'),
      },
      {
        Key: 'hammertime:cantTouchThisBetween',
        Value: `${moment.utc().add(5, 'days').format('YYYY-MM-DD')} and ${moment.utc().add(10, 'days').format('YYYY-MM-DD')}`,
      },
    ];

    expect(canITouchThis(tags)).to.be.true;
  });

  it('should return false if one tag check returns true', () => {
    const tags = [
      {
        Key: 'hammertime:cantTouchThisBefore',
        Value: moment.utc().add(2, 'days').format('YYYY-MM-DD'),
      },
      {
        Key: 'hammertime:cantTouchThisBetween',
        Value: `${moment.utc().add(5, 'days').format('YYYY-MM-DD')} and ${moment.utc().add(10, 'days').format('YYYY-MM-DD')}`,
      },
    ];

    expect(canITouchThis(tags)).to.be.false;
  });

  it('should return false if every tag check returns true', () => {
    const tags = [
      {
        Key: 'hammertime:cantTouchThisBefore',
        Value: moment.utc().add(2, 'days').format('YYYY-MM-DD'),
      },
      {
        Key: 'hammertime:cantTouchThisBetween',
        Value: `${moment.utc().add(-5, 'days').format('YYYY-MM-DD')} and ${moment.utc().add(10, 'days').format('YYYY-MM-DD')}`,
      },
    ];

    expect(canITouchThis(tags)).to.be.false;
  });

  it('should return false if just one cantTouchThisTag', () => {
    const tags = [
      {
        Key: 'hammertime:cantTouchThis',
      },
      {
        Key: 'hammertime:cantTouchThisBetween',
        Value: `${moment.utc().add(5, 'days').format('YYYY-MM-DD')} and ${moment.utc().add(10, 'days').format('YYYY-MM-DD')}`,
      },
    ];

    expect(canITouchThis(tags)).to.be.false;
  });
});
