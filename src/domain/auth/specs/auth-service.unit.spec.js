const { MissingParamError } = require('../../../shared/global/errors')
const AuthService = require('../auth-service')

const makeUserRepository = () => {
  class UserRepositoryMock {
    async getUserByEmail (email) {
      this.email = email
      return this.user
    }
  }
  const userRepositoryMock = new UserRepositoryMock()
  userRepositoryMock.user = { password: 'hashed_password' }
  return userRepositoryMock
}

const makeSut = () => {
  const userRepositoryMock = makeUserRepository()
  const sut = new AuthService({ userRepository: userRepositoryMock })
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
