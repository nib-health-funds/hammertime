const isInOperatingTimezone = require('../../src/operatingTimezone/isInOperatingTimezone');

describe('isInOperatingTimezone()', () => {
  it('should return true when tags contain a operating timezone the is equal to the current operating timezone', () => {
    const currentOperatingTimezone = 'Australia/Sydney';
    const tags = [{
      Key: 'hammertime:operatingTimezone',
      Value: currentOperatingTimezone,
    }];
    const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
    expect(isInCurrentOperatingTimezone(tags)).to.be.true;
  });

  it('should return false when tags do not contain a operating timezone the is equal to the current operating timezone', () => {
    const currentOperatingTimezone = 'Australia/Sydney';
    const tags = [{
      Key: 'hammertime:operatingTimezone',
      Value: 'Pacific/Auckland',
    }];
    const isInCurrentOperatingTimezone = isInOperatingTimezone(currentOperatingTimezone);
    expect(isInCurrentOperatingTimezone(tags)).to.be.false;
  });
});
