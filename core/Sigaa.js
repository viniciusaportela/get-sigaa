const Colors = require('colors');
const cheerio = require('cheerio');
const BrowserGenerator = require('../core/BrowserGenerator');
const { processTable } = require('../core/utils');

/**
 * @class
 * @version 0.1.0
 * @author Vinícius de Araújo Portela (vinicius-portela)
 * @license MIT
 * 
 * Manage all Sigaa Institutions
 */
class Sigaa {

  /**
   * Initialize Sigaa. Insert Configuration
   * 
   * @param {Object} config - Start Configurations
   * @param {('IFPA' | 'other')} config.institution - Institution Initials
   * @param {Object} config.url - Custom URL to not verified Institutions
   * @param {String} config.url.base - Base Url of Website
   * @param {String} config.url.home - Home Page
   * @param {Boolean} [config.debug=false] - Start
   */
  constructor(config) {

    if (config.debug) {
      this.debug = true;
    } else this.debug = false;
    this.debug && console.log(`[${Colors.magenta('Debug')}] Debug Mode Active!`);

    this.debug && console.log(`[${Colors.green('Sigaa')}] Get Configuration from ${config.institution}`);
    require('../institutions/' + config.institution + '.js')(this);
    this.institution = config.institution;

    // Set custom values (override institution values)
    if (config.url) this.url = config.url
  }

  /**
   * Get a list of all course
   */
  async getCourses() {
    //TODO: Implement custom Object (Schema / Enum)
    const debug = this.debug;
    const debugName = this.institution;

    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Generating Browsers`);
    const browsers = await Promise.all(BrowserGenerator.generateBrowsers(this.courses.length));

    // Create a Page for each browser
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Creating Pages`);
    const pages = await Promise.all(browsers.map(browser => { return browser.newPage() }))

    // Go For Each Modality
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Redirecting to Each Page`);
    await Promise.all(pages.map((page, index) => {
      let item = this.courses[index]
      debug && console.log(`[${Colors.blue(debugName)}][getCourse]` + ` ${this.url.base}/sigaa/public/curso/lista.jsf?nivel=${item.level}&aba=${item.id}`);
      return page.goto(`${this.url.base}/sigaa/public/curso/lista.jsf?nivel=${item.level}&aba=${item.id}`, { waitUntil: 'domcontentloaded', timeout: 0 })
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
      return processTable($('.listagem'), { title: this.courses[index].title, debug });
    })

    let finalRes = []
    res.map(item => finalRes.push(item))

    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Processed!`);
    debug && console.log(`[${Colors.blue(debugName)}][getCourse] Closing all conections`);
    await Promise.all(BrowserGenerator.closeAll(browsers));

    return finalRes;
  }

  /**
   * Get a list of students from a specific course
   * @param {Number} course - The Course ID
   */
  async getStudentsFromCourse(course) {
    const debug = this.debug;
    const debugName = this.institution;

    debug && console.log(`[${Colors.blue(debugName)}][getStudentsFromCourse] Getting Students from '${course}' course id`);
    const browser = await require('puppeteer').launch();
    const page = await browser.newPage();

    debug && console.log(`[${Colors.blue(debugName)}][getStudentsFromCourse] ${this.url.base}/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=${course}`);
    await page.goto(`${this.url.base}/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=${course}`, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const $ = require('cheerio').load(html);

    const res = processTable($('#table_lt'), { headConfig: 'tr', titleless: true, ignoreLast: true, debug })
    debug && console.log(`[${Colors.blue(debugName)}][getStudentsFromCourse] Done!`);
    debug && console.log(`[${Colors.blue(debugName)}][getStudentsFromCourse] Closing the connection`);
    await browser.close();

    return res;
  }
}

module.exports = Sigaa;