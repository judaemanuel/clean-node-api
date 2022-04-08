const MissingParamError = require('../global/errors/missing-param-error')
const jwt = require('jsonwebtoken')

module.exports = class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    if (!id) {
      throw new MissingParamError('user id')
    }
    const token = jwt.sign(id, this.secret)
    return token
  }
}
