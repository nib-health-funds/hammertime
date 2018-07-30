const operatingTimezone = require('../../src/tags/operatingTimezone');
const config = require('../../src/config');

describe('operatingTimezone()', () => {

  process.env.defaultOperatingTimezone = 'UTC';

  it('should return the operating timezone tag value if only 1 is found', () => {
    const operatingTimeZoneValue = 'Australia/Sydney';
    const tags = [
      { Key: 'hammertime:operatingTimezone', Value: operatingTimeZoneValue },
    ];
    expect(operatingTimezone(tags)).to.be.eq(operatingTimeZoneValue);
  });

  it('should return the default operating timezone tag value no operating timezone tags found', () => {
    const operatingTimeZoneValue = 'Australia/Sydney';
    const tags = [
      { Key: 'Not a timezone tag', Value: operatingTimeZoneValue },
      { Key: 'Another that is not a timezone tag', Value: operatingTimeZoneValue },
    ];
    expect(operatingTimezone(tags)).to.be.eq(config.defaultOperatingTimezone);
  });

  it('should return the default operating timezone tag value if more than 1 is found', () => {
    const operatingTimeZoneValue = 'Australia/Sydney';
    const tags = [
      { Key: 'hammertime:operatingTimezone', Value: operatingTimeZoneValue },
      { Key: 'hammertime:operatingTimezone', Value: operatingTimeZoneValue },
    ];
    expect(operatingTimezone(tags)).to.be.eq(config.defaultOperatingTimezone);
  });
});
