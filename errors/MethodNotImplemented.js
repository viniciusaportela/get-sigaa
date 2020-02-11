const Colors = require('colors')

class MethodNotImplemented extends Error {
  constructor(message) {
    super(Colors.red(message))
    this.name = Colors.red('MethodNotImplemented')
    Error.captureStackTrace(this, MethodNotImplemented)
  }
}

module.exports = MethodNotImplemented