const AuthService = require('../auth-service')

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
  test('Should call UserRepository getUserByEmail with correct email', async () => {
    const { sut, userRepositoryMock } = makeSut()
    await sut.authenticate('any_email@mail.com', 'any_password')
    expect(userRepositoryMock.email).toBe('any_email@mail.com')
  })

  test('Should throw if no UserRepository is provided', async () => {
    const sut = new AuthService()
    const promise = sut.authenticate('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no UserRepository has no getUserByEmail method', async () => {
    const sut = new AuthService({})
    const promise = sut.authenticate('any_email@mail.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if UserRepository getUserByEmail returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.authenticate('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBe(null)
  })
})
