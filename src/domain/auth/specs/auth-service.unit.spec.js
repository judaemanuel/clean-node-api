const { MissingParamError, InvalidParamError } = require('../../../shared/global/errors')

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

class UserRepositoryMock {
  async getUserByEmail (email) {
    this.email = email
  }
}

const makeSut = () => {
  const userRepositoryMock = new UserRepositoryMock()
  const sut = new AuthService(userRepositoryMock)
  return {
    sut,
    userRepositoryMock
  }
}

describe('Auth Service', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.authenticate()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.authenticate('any_email@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
