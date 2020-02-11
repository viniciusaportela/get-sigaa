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
 * @param {Object} config Configuration
 * @param {('structured'|,'flat')} config.mode - What gonna be the return format
 * @param {String} config.title - The table title (root)
 * @param {('default'|'tr')} [config.head] - default = on thead, tr = is a tr element instead of thead
 * @param {Boolean} config.titleless - Has title or not (root node or Array)
 * @param {Boolean} config.ignoreLast - Ignore the last element of table
 * @param {Boolean} config.debug - If is in debug mode or not
 */
function processTable(table, config = {
  head: 'default',
  titleless: false,
  mode: 'structured',
  ignoreLast: false,
  debug: false,
}) {

  const Colors = require('colors');
  $ = require('cheerio');

  let curIndex = -1
  let response;

  // Check if has a root node or not
  // root node = [{title: ..., data: ...}]
  // titleless -> [data..., data..., data..., data...]
  if (config.titleless) {
    response = []
  } else {
    response = {
      modalidade: config.title,
      categorias: []
    }
  }

  // Get Head from Table
  let head = []
  if (config.head === 'default') {
    $(table).find('thead tr th').toArray().map(th => {
      head.push(cleanText($(th).text()));
    })
  } else if (config.head === 'tr') {
    $($(table).find('tbody tr').toArray()[0]).children().toArray().forEach(td => {
      head.push(cleanText($(td).text()));
    })
  } else {
    throw Error('config.head is not correctly set, available values are: default, tr')
  }

  const elements = $(table).find('tbody tr').toArray()

  //Check if the first element is head or not
  if (config.head === 'tr') {
    config.debug && console.log(`[${Colors.grey('utils')}][processTable] Removing head from list`)
    elements.shift();
  }

  elements.map((element, index) => {
    let child = $(element).find('.subFormulario')

    if (child.length) {
      // New category
      if (config.titleless) {
        response.categorias.push({
          categoria: cleanText(child.text()),
          cursos: [],
        })
      } else {
        response.push({
          categoria: cleanText(child.text()),
          cursos: [],
        })
      }

      curIndex++;
    } else {
      // Add Course
      if (!config.ignoreLast || (config.ignoreLast && index < elements.length - 1)) {
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

        if (config.titleless) {
          if (curIndex === -1) {
            response.push(curCourse)
          } else response[curIndex].cursos.push(curCourse)
        } else {
          if (curIndex === -1) {
            response.push(curCourse)
          } else response.categorias[curIndex].cursos.push(curCourse)
        }
      } else { config.debug && console.log(`[${Colors.grey('utils')}][processTable] Ignoring last element`) }
    }
  })

  return response;
}

module.exports = {
  cleanText,
  processTable
}