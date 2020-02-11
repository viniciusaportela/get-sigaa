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

}

module.exports = BrowserGenerator