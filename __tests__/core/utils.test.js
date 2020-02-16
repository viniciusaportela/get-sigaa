const utils = require('../../core/utils');

describe('Utils Tests', () => {
  it('should clean the text correctly (Remove tabs and newlines)', () => {
    expect(utils.cleanText(`\n\n a \n b \t\t cd \t ef \t\n gh \n\t content here`)).toBe(
      ` a  b  cd  ef  gh  content here`
    )
  })

  // processTable doesn't will be tested here, since it was projected to
  // work especificly to differents institutions.
  // Then this function will be tested on integrations
});