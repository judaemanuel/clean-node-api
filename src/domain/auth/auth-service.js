const { MissingParamError } = require('../../shared/global/errors')

module.exports = class AuthService {
  constructor (UserRepository) {
    this.UserRepository = UserRepository
  }

  async authenticate (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.UserRepository.getUserByEmail(email)
    if (!user) {
      return null
    }
  }
}
