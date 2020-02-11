/**
 * Example File
 */

const Sigaa = require('./');
const ifpa = new Sigaa({
  institution: 'IFPA',
  debug: true,
});

ifpa.getCourses()