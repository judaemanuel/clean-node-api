const { MissingParamError } = require('../../shared/global/errors')

module.exports = class AuthService {
  constructor ({
    userRepository,
    encrypter,
    tokenGenerator
  } = {}) {
    this.userRepository = userRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async authenticate (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.userRepository.getUserByEmail(email)
    const isValid = user && await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }
    return await this.tokenGenerator.generate(user.id)
  }
}
