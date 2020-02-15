const Sigaa = require('./');
const fs = require('fs');

/**
 * Example File
 */

// IFPA
const ifpa = new Sigaa({
  institution: 'IFPA',
  debug: true,
  verifyVersion: true,
});

(async () => fs.writeFileSync('./ifpa.json', JSON.stringify(await ifpa.getStudentsFromCourse(204))))();
(async () => fs.writeFileSync('./ifpa2.json', JSON.stringify(await ifpa.getCourses())))();

// UFOPA
const ufopa = new Sigaa({
  institution: 'UFOPA',
  debug: true,
  verifyVersion: true,
});

(async () => fs.writeFileSync('./ufopa.json', JSON.stringify(await ufopa.getCourses())))();