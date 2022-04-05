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

const makeEncrypter = () => {
  class EncryptedMock {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterMock = new EncryptedMock()
  encrypterMock.isValid = true
  return encrypterMock
}

const makeSut = () => {
  const userRepositoryMock = makeUserRepository()
  const encrypterMock = makeEncrypter()
  const sut = new AuthService(userRepositoryMock, encrypterMock)
  return {
    sut,
    userRepositoryMock,
    encrypterMock
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

  test('Should return null if an invalid email is provided', async () => {
    const { sut, userRepositoryMock } = makeSut()
    userRepositoryMock.user = null
    const accessToken = await sut.authenticate('invalid_email@mail.com', 'any_password')
    expect(accessToken).toBe(null)
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut, encrypterMock } = makeSut()
    encrypterMock.isValid = false
    const accessToken = await sut.authenticate('any_email@mail.com', 'invalid_password')
    expect(accessToken).toBe(null)
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, userRepositoryMock, encrypterMock } = makeSut()

    await sut.authenticate('valid_email@mail.com', 'any_password')
    expect(encrypterMock.password).toBe('any_password')
    expect(encrypterMock.hashedPassword).toBe(userRepositoryMock.user.password)
  })
})
