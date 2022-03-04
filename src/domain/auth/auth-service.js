const { MissingParamError, InvalidParamError } = require('../../shared/global/errors')

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
    if (!this.UserRepository) {
      throw new MissingParamError('UserRepository')
    }
    if (!this.UserRepository.getUserByEmail) {
      throw new InvalidParamError('UserRepository')
    }
    const user = await this.UserRepository.getUserByEmail(email)
    if (!user) {
      return null
    }
  }
}
