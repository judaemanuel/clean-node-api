const { MissingParamError } = require('../../shared/global/errors')

module.exports = class AuthService {
  constructor (userRepository, encrypter) {
    this.userRepository = userRepository
    this.encrypter = encrypter
  }

  async authenticate (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      return null
    }
    await this.encrypter.compare(password, user.password)
    return null
  }
}
