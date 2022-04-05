const AuthService = require('../auth-service')

const makeUserRepository = () => {
  class UserRepositoryMock {
    async getUserByEmail (email) {
      this.email = email
      return this.user
    }
  }
  const userRepositoryMock = new UserRepositoryMock()
  userRepositoryMock.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
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

const makeTokenGenerator = () => {
  class TokenGeneratorMock {
    async generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }
  const tokenGeneratorMock = new TokenGeneratorMock()
  tokenGeneratorMock.accessToken = 'any_token'
  return tokenGeneratorMock
}

const makeSut = () => {
  const userRepositoryMock = makeUserRepository()
  const encrypterMock = makeEncrypter()
  const tokenGeneratorMock = makeTokenGenerator()
  const sut = new AuthService(userRepositoryMock, encrypterMock, tokenGeneratorMock)
  return {
    sut,
    userRepositoryMock,
    encrypterMock,
    tokenGeneratorMock
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

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, userRepositoryMock, tokenGeneratorMock } = makeSut()
    tokenGeneratorMock.userId = 'any_id'
    await sut.authenticate('valid_email@mail.com', 'valid_password')

    expect(tokenGeneratorMock.userId).toBe(userRepositoryMock.user.id)
  })
})
