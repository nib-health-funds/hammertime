const getHammerTimeTags = require('../../src/tags/getHammerTimeTags');

describe('getHammerTimeTags()', () => {
  it('should only return hammertime tags', () => {
    const tags = [{
      Key: 'notHammerTimeTag',
    },
    {
      Key: 'hammertime:canttouchthis',
    }];
    expect(getHammerTimeTags(tags)).to.deep.equal([{ Key: 'hammertime:canttouchthis' }]);
  });

  it('should return empty array when no hammer time tags found', () => {
    const tags = [{
      Key: 'notHammerTimeTag',
    },
    {
      Key: 'somethingElse',
    }];
    expect(getHammerTimeTags(tags)).to.deep.equal([]);
  });
});
