const { MissingParamError } = require('../../../shared/global/errors')

class AuthService {
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
    await this.UserRepository.getUserByEmail(email)
  }
}

class UserRepositoryMock {
  async getUserByEmail (email) {
    this.email = email
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

  test('Should call UserRepository GetUserByEmail with correct email', async () => {
    const userRepositoryMock = new UserRepositoryMock()
    const sut = new AuthService(userRepositoryMock)
    await sut.authenticate('any_email@mail.com', 'any_password')

    expect(userRepositoryMock.email).toBe('any_email@mail.com')
  })
})
