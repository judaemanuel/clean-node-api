const { MissingParamError } = require('../../../shared/global/errors')

class AuthService {
  async authenticate (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

describe('Auth Service', () => {
  test('Should throw if no email is provided', async () => {
    const sut = new AuthService()
    const promisse = sut.authenticate()
    expect(promisse).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const sut = new AuthService()
    const promisse = sut.authenticate('any_email@mail.com')
    expect(promisse).rejects.toThrow(new MissingParamError('password'))
  })
})
