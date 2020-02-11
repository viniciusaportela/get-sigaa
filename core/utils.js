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

  // Get th information
  let head = []
  $(table).find('thead tr th').toArray().map(th => {
    head.push(cleanText($(th).text()));
  })

  $(table).find('tbody tr').toArray().map(element => {
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
      let curCourse = {}
      head.map((item, index) => {
        //Probably Link
        if (item === '') {
          curCourse.Link = $(courseInfo[index]).find('a').attr('href');
        } else {
          curCourse[item] = cleanText($(courseInfo[index]).text());
        }
      })

      response.categorias[curIndex].cursos.push(curCourse)
    }
  })

  return response;
}

module.exports = {
  cleanText,
  processTable
}