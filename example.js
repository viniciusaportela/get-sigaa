/**
 * Example File
 */

const Sigaa = require('./');
const ifpa = new Sigaa({
  institution: 'IFPA',
  debug: true,
});

const fs = require('fs');
(async () =>
  fs.writeFileSync('./example.json', JSON.stringify(await ifpa.getCourses()))
)();