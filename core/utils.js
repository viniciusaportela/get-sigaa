/**
 * Common Function to all Sigaa websites and others
 */

/**
  * Removes tabulations and newlines from given text
  * @param {String} text - Text to clean
  */
function cleanText(text) {
  return text.replace(/\n|\t/g, '');
}

/**
 * Process a table and returns a Array
 * @param {Object} table Table in cheerio Element
 * @param {Object} config configuration
 * @param {('structured'|,'flat')} config.mode
 * @param {String} config.title
 */
function processTable(table, config) {
  $ = require('cheerio')

  let response = {
    modalidade: config.title,
    categorias: []
  }
  let curIndex = -1

  console.log($(table).find('tr').lenght);
  $(table).find('tr').toArray().map(element => {
    let child = $(element).find('.subFormulario')

    if (child.length) {
      // New category
      console.log('new category');
      response.categorias.push({
        categoria: cleanText(child.text()),
        cursos: [],
      })
      curIndex++;
    } else {
      // Add Course
      console.log('new course');
      let courseInfo = $(element).children().toArray();
      let nome = cleanText($(courseInfo[0]).text());
      let sede = cleanText($(courseInfo[1]).text());
      let participacao = cleanText($(courseInfo[2]).text());
      let link = $(courseInfo[3]).find('a').attr('href');

      response.categorias[curIndex].cursos.push({
        nome, sede, participacao, link
      })
    }
  })

  return response;
}

module.exports = {
  cleanText,
  processTable
}