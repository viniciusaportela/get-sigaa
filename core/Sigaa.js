/**
 * @class
 * 
 * Manage all Sigaa data
 */
class Sigaa {
  /**
   * Initialize Sigaa. Insert Configuration
   * 
   * @param {Object} config 
   * @param {('ifpa' | 'other')} config.institution
   * @param {Object} config.url - Custom URL to not verified Institutions
   */
  constructor(config) {

    if (config.institution === 'other') {
      //Not verified institution website
      this.baseUrl = config.url;
    } else {
      this.baseUrl = require('../consts/urls.json')[config.institution];
    }


  }
}

module.exports = Sigaa;