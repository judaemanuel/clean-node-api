const LoginRouter = require('../login-router')

const makeSut = () => {
  class AuthServiceMock {
    authenticate (email, password) {
      this.email = email
      this.password = password
    }
  }
  const authServiceMock = new AuthServiceMock()
  const sut = new LoginRouter(authServiceMock)
  return {
    sut,
    authServiceMock
  }
}

describe('Login Router', () => {
  test('Should call AuthService with correct params', () => {
    const { sut, authServiceMock } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    sut.route(httpRequest)
    expect(authServiceMock.email).toBe(httpRequest.body.email)
    expect(authServiceMock.password).toBe(httpRequest.body.password)
  })
})
