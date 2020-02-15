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
   * @param {('IFPA' | 'other')} institution - Institution Initials
   * @param {Object} url - Custom URL to not verified Institutions
   * @param {String} url.base - Base Url of Website
   * @param {String} url.home - Home Page
   * @param {Boolean} verifyVersion - Verify everyday if the package is up-to-date with sigaa website
   * @param {Boolean} [debug=false] - Start
   */
  constructor({
    institution,
    url,
    verifyVersion = false,
    debug = false
  } = {}) {

    if (debug) {
      this.debug = true;
    } else this.debug = false;
    this.debug && console.log(`[${Colors.magenta('Debug')}] Debug Mode Active!`);

    this.debug && console.log(`[${Colors.green('Sigaa')}] Get Configuration from ${institution}`);
    require('../institutions/' + institution + '.js')(this);
    this.institution = institution;

    // Set custom values (override institution values)
    if (url) this.url = url;
    this.verifyVersion = verifyVersion;
  }

  /**
   * Get a list of all course
   */
  async getCourses() {
    //TODO: Implement custom Object (Schema / Enum)
    const debug = this.debug;
    const debugName = this.institution;

    this.verifyVersionFn();

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

    this.verifyVersionFn();

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

  /**
   * @internal
   * @private
   * 
   * Verify if a given version is similar to the sigaa website
   */
  async verifyVersionFn() {
    // Verify if is to verify or not
    if (!this.verifyVersion) return;

    const debug = this.debug;
    const debugName = this.institution;
    const fs = require('fs');
    const join = require('path').join;

    debug && console.log(`[${Colors.blue(debugName)}][verifyVersionFn] Verifying Version`);

    // First, check if was already verified today
    if (fs.existsSync(join(__dirname, '../time.json'))) {
      debug && console.log(`[${Colors.blue(debugName)}][verifyVersionFn] time.json exits!`);
      let json = require(join(__dirname, '../time.json'));

      if (json[this.institution] === undefined) {
        await this.verifyPageDownload();

        json[this.institution] = Date.now();
        fs.writeFileSync(join(__dirname, '../time.json'), JSON.stringify(json));
      } else {
        if (Date.now() - json[this.institution].lastUpdate > 86400000) {
          // Passed one Day, Verify
          debug && console.log(`[${Colors.blue(debugName)}][verifyVersionFn] Passed one day, checking for version again!`);
          await this.verifyPageDownload();

          json[this.institution] = Date.now();
          fs.writeFileSync(join(__dirname, '../time.json'), JSON.stringify(json));
        } else return;
      }
    } else {
      // File not exists, or there is no time data for this institution
      // Verify
      debug && console.log(`[${Colors.blue(debugName)}][verifyVersionFn] Not verified for version yet, starting`);
      await this.verifyPageDownload();

      let jsonData = {}
      jsonData[this.institution] = {
        lastUpdate: Date.now()
      }

      fs.writeFileSync(join(__dirname, '../time.json'), JSON.stringify(jsonData));
    }
  }

  /**
   * @internal
   * @private
   * 
   * Downloads the page and verify version from sigaa
   */
  async verifyPageDownload() {
    const debug = this.debug;
    const debugName = this.institution;
    const { cleanText } = require('./utils');

    const browser = await require('puppeteer').launch();
    const page = await browser.newPage();
    await page.goto(this.url.base + this.url.home);
    const html = await page.content();

    const $ = cheerio.load(html);
    const version = cleanText($('#rodape a').text());

    if (version !== this.support.lastVersion) {
      // Not up-to-date
      process.emitWarning(Colors.yellow(
        '> get-sigaa is not up-to-date with given institution. ' + `(${this.institution}) ` +
        'You can keep using it normally, but there is a chance of code broking'
      ));
    } else {
      debug && console.log(`[${Colors.blue(debugName)}][downloadVerifyPage] Everything is up-to-date!`);
    }

    await browser.close();
  }
}

module.exports = Sigaa;