//Custom Errors
const MethodNotImplemented = require('../errors/MethodNotImplemented')

const Colors = require('colors')

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
    this.debug && console.log(`[${Colors.magenta('Debug')}] Debug Mode Active!`)

    this.institution = require('../institutions/' + config.institution + '.js')
    this.debug && console.log(`[${Colors.green('Sigaa')}] Institution Instance: `, this.institution)

    //List of Institution Methods
    this.methods = Object.getOwnPropertyNames(this.institution).filter(item => {
      return typeof this.institution[item] === 'function'
    })
    this.debug && console.log(`[${Colors.green('Sigaa')}] Institution Methods: `, this.methods)
  }

  /**
   * Get a list of all course
   */
  async getCourses() {
    return this.execIf('getCourses')
  }

  /**
   * Get a list of students from a specific course
   * @param {Number} course - The Course ID
   */
  async getStudentsFromCourse(course) {
    return this.execIf('getStudentsFromCourse', [...course])
  }

  /**
   * Get a list of all students from all courses
   */
  async getStudents() {

  }

  /**
   * 
   */
  async getEgresses() {

  }

  /**
   * @internal
   * @private
   * 
   * Execute if this method exists in Institution Class
   * @param {String} func - Method Name
   * @param {Array} [params=[]] - List of Params
   */
  execIf(func, params = []) {
    if (this.methods.filter(item => {
      if (item === func) {
        return true;
      } else return false;
    }).length > 0) {
      return this.institution[func]({ debug: this.debug }, ...params);
    } else { throw new MethodNotImplemented("> This function wasn't implemented or not work in this institution") }
  }
}

module.exports = Sigaa;