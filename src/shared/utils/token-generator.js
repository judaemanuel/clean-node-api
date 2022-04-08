const MissingParamError = require('../global/errors/missing-param-error')
const jwt = require('jsonwebtoken')

module.exports = class TokenGenerator {
  async generate (id) {
    if (!id) {
      throw new MissingParamError('user id')
    }
    const token = jwt.sign(id, 'secret')
    return token
  }
}
