/***********************
  ╦ ╦╔╦╗╦╦  ╔═╗
  ║ ║ ║ ║║  ╚═╗
  ╚═╝ ╩ ╩╩═╝╚═╝

  Common functions to all Sigaa websites and others
************************/

/**
 * Removes tabulations and newlines from given text
 * @param {String} text - Text to clean
 */
function cleanText(text) {
  return text.replace(/\n|\t/g, '');
}

/**
 * Process a table and returns a Array
 * 
 * @param {Object} table - Table in cheerio element format
 * @param {Object} config - Configuration
 * @param {String} [config.title] - The table title (root)
 * @param {('default'|'tr')} [config.headConfig] - default = on thead, tr = is a tr element instead of thead
 * @param {Boolean} [config.titleless] - Has title or not (root node or Array)
 * @param {Boolean} [config.ignoreLast] - Ignore the last element of table
 * @param {Boolean} [config.debug] - If is in debug mode or not
 */
function processTable(table, {
  title,
  headConfig = 'default',
  titleless = false,
  ignoreLast = false,
  debug = false,
} = {}) {

  const Colors = require('colors');
  $ = require('cheerio');

  let curIndex = -1
  let response;

  // Check if has a root node or is titleless
  // root node = [{title: ..., data: ...}]
  // titleless -> [data..., data..., data..., data...]
  if (titleless) {
    response = []
  } else {
    response = {
      modalidade: title,
      categorias: []
    }
  }

  // Get Head from Table
  let head = []
  if (headConfig === 'default') {
    $(table).find('thead tr th').toArray().map(th => {
      head.push(cleanText($(th).text()));
    })
  } else if (headConfig === 'tr') {
    $($(table).find('tbody tr').toArray()[0]).children().toArray().forEach(td => {
      head.push(cleanText($(td).text()));
    })
  } else {
    throw Error('headConfig is not correctly set, available values are: default, tr')
  }

  const elements = $(table).find('tbody tr').toArray()

  // Check if the first element is head or not
  if (headConfig === 'tr') {
    debug && console.log(`[${Colors.grey('utils')}][processTable] Removing head from list`)
    elements.shift();
  }

  elements.map((element, index) => {
    let child = $(element).find('.subFormulario')

    if (child.length) {
      // New category
      if (!titleless) {
        response.categorias.push({
          categoria: cleanText(child.text()),
          cursos: [],
        })
      }

      curIndex++;
    } else {
      // Add Course
      if (!ignoreLast || (ignoreLast && index < elements.length - 1)) {
        let courseInfo = $(element).children().toArray();
        let curCourse = {};

        head.map((item, index) => {
          // Probably Link
          if (item === 'Nome') {
            // Separate ID from name (Check before)
            const pattern = /(\d{1,}) (?:-) (.*)/;
            const text = cleanText($(courseInfo[index]).text());

            if (pattern.test(text)) {
              let re = pattern.exec(text);
              curCourse.ID = re[1];
              curCourse.Nome = re[2];
            } else {
              curCourse[item] = cleanText($(courseInfo[index]).text());
            }
          } else if (item === '') {
            curCourse.Link = $(courseInfo[index]).find('a').attr('href');
          } else {
            curCourse[item] = cleanText($(courseInfo[index]).text());
          }
        })

        if (titleless) {
          if (curIndex === -1) {
            response.push(curCourse)
          } else response[curIndex].push(curCourse)
        } else {
          if (curIndex === -1) {
            response.push(curCourse)
          } else response.categorias[curIndex].cursos.push(curCourse)
        }
      } else { debug && console.log(`[${Colors.grey('utils')}][processTable] Ignoring last element`) }
    }
  })

  return response;
}

/**
 * Custom console log, used for debug mode
 * @param {String} msg - Message to write
 * @param {Boolean} debug - If is in debug mode or not
 * @param {Arrat} [stack] - [Optional] Stack of Names in Front of Message
 */
function print(msg, debug, ...stack) {
  if (debug) {
    const Colors = require('colors');
    const consoleStart = (
      stack.map((item, index) => {
        return ('[' + ((index === 0) ? Colors.blue(item) : item) + ']')
      }).join('')
    );

    console.log(consoleStart + ' ' + msg);
  }
}

module.exports = {
  cleanText,
  processTable,
  print
}