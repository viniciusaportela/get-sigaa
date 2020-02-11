/**
 * Example File
 */

// IFPA
const Sigaa = require('./');
const ifpa = new Sigaa({
  institution: 'IFPA',
  debug: true,
});

const fs = require('fs');
(async () => fs.writeFileSync('./example.json', JSON.stringify(await ifpa.getStudentsFromCourse(204))))();

// UFOPA
/*const Sigaa = require('./');
const ufopa = new Sigaa({
  institution: 'UFOPA',
  debug: true,
});

const fs = require('fs');
(async () => fs.writeFileSync('./example.json', JSON.stringify(await ufopa.getCourses())))();*/