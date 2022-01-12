const LoginRouter = require('../login-router')

const makeSut = () => {
  const authServiceMock = makeAuthService()
  const sut = new LoginRouter(authServiceMock)
  return {
    sut,
    authServiceMock
  }
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
})
