const Sigaa = require('../../core/Sigaa')

describe('IFPA Institution Tests', () => {
  test('should get the courses lists, without warning and errors', async () => {
    const warn = jest.spyOn(global.console, 'warn');

    const ifpa = new Sigaa({ institution: 'IFPA', verifyVersion: true })
    await ifpa.getCourses();

    expect(warn).not.toHaveBeenCalled();
  }, 60000)

  test('should get the students list from course, without warning and errors', async () => {
    const warn = jest.spyOn(global.console, 'warn');

    const ifpa = new Sigaa({ institution: 'IFPA', verifyVersion: true })
    await ifpa.getStudentsFromCourse(204);

    expect(warn).not.toHaveBeenCalled();
  }, 60000)
});