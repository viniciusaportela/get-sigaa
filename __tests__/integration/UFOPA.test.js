const Sigaa = require('../../core/Sigaa')

describe('UFOPA Institution Tests', () => {
  test('should get the courses lists, without warning and errors', async () => {
    const warn = jest.spyOn(global.console, 'warn');

    const ufopa = new Sigaa({ institution: 'UFOPA', verifyVersion: true })
    await ufopa.getCourses();

    expect(warn).not.toHaveBeenCalled();
  }, 60000)
});