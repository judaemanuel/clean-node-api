const { MissingParamError } = require('../../../shared/global/errors')

class AuthService {
  async authenticate (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

describe('Auth Service', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthService()
    const promisse = sut.authenticate()
    expect(promisse).rejects.toThrow(new MissingParamError('email'))
  })
})
