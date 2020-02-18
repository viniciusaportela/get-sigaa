const Colors = require('colors');
const cheerio = require('cheerio');
const BrowserGenerator = require('../core/BrowserGenerator');
const { processTable, print } = require('../core/utils')

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
   * @param {Object} param
   * @param {('IFPA'|'UFOPA')} param.institution - Institution Initials
   * @param {Object} [param.url] - Custom URL to not Verified Institutions
   * @param {String} param.url.base - Base Url of Website (https://website.com)
   * @param {String} param.url.home - Home Page Path (/to/home/page)
   * @param {Boolean} [param.verifyVersion] - Verify everyday if the package is up-to-date with sigaa website
   * @param {Boolean} [param.debug] - Log Actions
   */
  constructor({
    institution,
    url,
    verifyVersion = false,
    debug = false
  } = {}) {

    this.debug = debug;
    print('Debug Mode Active!', this.debug, Colors.green('Sigaa'));

    print(`Get configuration from ${institution}'`, this.debug, Colors.green('Sigaa'));
    require('../institutions/' + institution + '.js')(this);

    // Set custom values (override institution default values)
    if (url) this.url = url;
    this.institution = institution;
    this.verifyVersion = verifyVersion;
  }

  /**
   * Get a list of all course
   */
  async getCourses() {

    //TODO: Make Complete Process Individually for each Course
    //Instead of each phase for each course

    const printParams = [this.debug, this.institution, 'getCourses']
    this.debug && console.time(`[${Colors.blue(this.institution)}][getCourses]`);
    print('getCourses()', this.debug, Colors.blue(this.institution));

    this.verifyCurrentVersion();

    // Create a Browser for each course (To simultaneously search)
    print('Generating Browsers', ...printParams);
    const browsers = await Promise.all(BrowserGenerator.generateBrowsers(this.courses.length));

    // Create a Page for each browser
    print('Creating Pages', ...printParams);
    const pages = await Promise.all(browsers.map(browser => { return browser.newPage() }))

    // Go For Each Modality
    print('Redirecting', ...printParams);
    await Promise.all(pages.map((page, index) => {
      let item = this.courses[index]

      print(`${this.url.base}/sigaa/public/curso/lista.jsf?nivel=${item.level}&aba=${item.id}`, ...printParams);
      return page.goto(`${this.url.base}/sigaa/public/curso/lista.jsf?nivel=${item.level}&aba=${item.id}`, { waitUntil: 'domcontentloaded', timeout: 0 })
    }))

    // Get Page Content
    print('Getting Page Content', ...printParams);
    const data = await Promise.all(pages.map((page, index) => {
      return page.content()
    }))

    // Proccess all content data
    print('Processing Page Content', ...printParams);
    const res = data.map((html, index) => {

      let $ = cheerio.load(html);
      return processTable($('.listagem'), {
        title: this.courses[index].title,
        debug: this.debug
      });
    })

    print('Processed!', ...printParams);
    print('Closing all conections', ...printParams);
    await Promise.all(BrowserGenerator.closeAll(browsers));

    this.debug && console.timeEnd(`[${Colors.blue(this.institution)}][getCourses]`);
    return res;
  }

  /**
   * Get a list of students from a specific course
   * @param {Number} course - The Course ID
   */
  async getStudentsFromCourse(course) {

    const printParams = [this.debug, this.institution, 'getSudentsFromCourse']
    if (this.debug) console.time(`[${Colors.blue(this.institution)}][getStudentsFromCourse]`);

    this.verifyCurrentVersion();

    print(`Getting Students from '${course}' course id`, ...printParams);
    const browser = await require('puppeteer').launch();
    const page = await browser.newPage();

    print(`${this.url.base}/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=${course}`, ...printParams);
    await page.goto(`${this.url.base}/sigaa/public/curso/alunos.jsf?lc=pt_BR&id=${course}`, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    const $ = require('cheerio').load(html);

    const res = processTable($('#table_lt'), { headConfig: 'tr', titleless: true, ignoreLast: true, debug: this.debug })
    print('Done!', ...printParams);
    print('Closing the connection', ...printParams);
    await browser.close();

    if (this.debug) console.timeEnd(`[${Colors.blue(this.institution)}][getStudentsFromCourse]`);

    return res;
  }

  /**
   * @internal
   * @private
   * 
   * Verify if a given version is similar to the sigaa website
   */
  async verifyCurrentVersion() {
    // Verify if is to verify or not
    if (!this.verifyVersion) return;

    const printParams = [this.debug, this.institution, 'verifyCurrentVersion']
    const fs = require('fs');
    const join = require('path').join;

    print('Verifying Version', ...printParams);

    // First, check if was already verified today
    if (fs.existsSync(join(__dirname, '../time.json'))) {
      print('time.json', ...printParams);
      let json = require(join(__dirname, '../time.json'));

      if (json[this.institution] === undefined) {
        print('Not verified for version yet, starting', ...printParams);
        await this.verifyVersionDownload();

        json[this.institution] = Date.now();
        fs.writeFileSync(join(__dirname, '../time.json'), JSON.stringify(json));
      } else {
        if (Date.now() - json[this.institution].lastUpdate > 86400000) {
          // Passed one Day, Verify
          print('Passed one day, checking for version again!', ...printParams);
          await this.verifyVersionDownload();

          json[this.institution] = Date.now();
          fs.writeFileSync(join(__dirname, '../time.json'), JSON.stringify(json));
        } else return;
      }
    } else {
      // File not exists, or there is no time data for this institution
      // Verify
      print('Not verified for version yet, starting', ...printParams);
      await this.verifyVersionDownload();

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
  async verifyVersionDownload() {
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