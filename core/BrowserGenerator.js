/**
 * @class
 * 
 * Generate Async Actions
 */
class BrowserGenerator {

  /**
   * Generates a specific quantity of Browsers Instances
   * @param {Number} ammount - The Number of Browsers to Generate
   * @returns {Array}
   */
  static generateBrowsers(ammount) {
    const puppeteer = require('puppeteer');
    let res = [];
    let i;

    for (i = 0; i < ammount; i++) {
      res.push(puppeteer.launch())
    }

    return res;
  }

  /**
   * Close all browser connections
   * 
   * @param {Array} browserInstances 
   */
  static closeAll(browserInstances) {
    return browserInstances.map(browser => {
      return browser.close()
    })
  }

}

module.exports = BrowserGenerator