const LoginRouter = require('../login-router')

const makeSut = () => {
  const authServiceMock = makeAuthService()
  const emailValidatorMock = makeEmailValidator()
  emailValidatorMock.isEmailValid = true
  const sut = new LoginRouter(authServiceMock, emailValidatorMock)
  return {
    sut,
    authServiceMock,
    emailValidatorMock
  }
}

const makeEmailValidator = () => {
  class EmailValidatorMock {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  return new EmailValidatorMock()
}

const makeAuthService = () => {
  class AuthServiceMock {
    async authenticate (email, password) {
      this.email = email
      this.password = password
      return this.accessToken
    }
  }
  return new AuthServiceMock()
}

describe('Login Router', () => {
  test('Should call AuthService with correct params', async () => {
    const { sut, authServiceMock } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(authServiceMock.email).toBe(httpRequest.body.email)
    expect(authServiceMock.password).toBe(httpRequest.body.password)
  })

  test('Should call AuthService with correct email', async () => {
    const { sut, emailValidatorMock } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorMock.email).toBe(httpRequest.body.email)
  })
})
