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
    const accessToken = await this.tokenGenerator.generate(user.id)
    await this.userRepository.updateUserAccessToken(user.id, accessToken)
    return accessToken
  }
}
