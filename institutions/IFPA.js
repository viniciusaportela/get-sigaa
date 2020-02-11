const BrowserGenerator = require('../core/BrowserGenerator');
const cheerio = require('cheerio');
const Colors = require('colors');

/**
 * @class
 * @version 1.0
 * @author Vinícius de Araújo Portela (vinicius-portela)
 * 
 * Instituto Federal de Ciência e Tecnologia do Pará
 */
class IFPA {
  static courses = [
    {
      title: 'Técnico',
      id: 'p-tecnico',
      level: 'T'
    },
    {
      title: 'Graduação',
      id: 'p-graduacao',
      level: 'G'
    },
    {
      title: 'Formação Complementar',
      id: 'p-formacao-complementar',
      level: 'F'
    },
    {
      title: 'Pós Graduação Stricto Sensu',
      id: 'p-stricto',
      level: 'S'
    },
    {
      title: 'Pós Graduação Lato Sensu',
      id: 'p-lato',
      level: 'L'
    },
  ]

  static url = {
    base: 'https://sigaa.ifpa.edu.br',
    home: 'https://sigaa.ifpa.edu.br/sigaa/public/home.jsf?modo=classico',
  }

  //TODO: Implement custom Object (Schema / Enum)
  static async getCourses(custom, courses = this.courses, url = this.url) {

    const { debug } = custom;
    const debugName = custom.institution ? custom.institution : 'IFPA';

    /*
      Generate the Necesary Browsers (5)
      - Técnico
      - Graduação
      - Formação Complementar
      - Pós Graduação
        - Stricto Sensu
        - Lato Sensu
    */

    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Generating Browsers`);
    const browsers = await Promise.all([...BrowserGenerator.generateBrowsers(courses.length)]);

    // Create a Page for each browser
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Creating Pages`);
    const pages = await Promise.all(browsers.map(browser => { return browser.newPage() }))

    // Go For Each Modality
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Redirecting to Each Page`);
    await Promise.all(pages.map((page, index) => {
      let item = courses[index]
      debug && console.log(`[${Colors.blue(debugName)}][getCourse]` + ` ${url.base}/sigaa/public/curso/lista.jsf?nivel=${item.level}&aba=${item.id}`);
      return page.goto(`${url.base}/sigaa/public/curso/lista.jsf?nivel=${item.level}&aba=${item.id}`)
    }))

    // Get Page Content
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Getting Page Content`);
    const data = await Promise.all(pages.map((page, index) => {
      return page.content()
    }))

    // Proccess all content data
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Proccessing Page Content`);
    const res = data.map((html, index) => {
      let $ = cheerio.load(html);
      let response = {
        modalidade: courses[index].title,
        categorias: []
      }
      let curIndex = -1

      $('.listagem tbody tr').toArray().map(element => {
        let child = $(element).find('.subFormulario')

        if (child.length) {
          // New category
          response.data.push({
            categoria: child.text(),
            cursos: [],
          })
          curIndex++;
        } else {
          // Add Course
          let courseInfo = $(element).children().toArray();
          let name = $(courseInfo[0]).text();
          let campus = $(courseInfo[1]).text();
          let participation = $(courseInfo[2]).text();
          let link = $(courseInfo[3]).find('a').attr('href');

          response.data[curIndex].data.push({
            name, campus, participation, link
          })
        }
      })

      return response;
    })

    console.dir(JSON.stringify(res))
  }

  static async

}

module.exports = IFPA