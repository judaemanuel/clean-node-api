const LoginRouter = require('../login-router')
const { MissingParamError, UnauthorizedError, InternalServerError, InvalidParamError } = require('../../../shared/helpers/errors')

const makeSut = () => {
  const authServiceMock = makeAuthService()
  const emailValidatorMock = makeEmailValidator()
  authServiceMock.accessToken = 'valid_token'
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

const makeAuthServiceWithError = () => {
  class AuthServiceMock {
    async authenticate () {
      throw new Error()
    }
  }
  return new AuthServiceMock()
}

const makeEmailValidatorWithError = () => {
  class EmailValidatorMock {
    isValid () {
      throw new Error()
    }
  }
  return new EmailValidatorMock()
}

describe('Login Router', () => {
  test('Should return 200 when valid credentials are provided', async () => {
    const { sut, authServiceMock } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toEqual(authServiceMock.accessToken)
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorMock } = makeSut()
    emailValidatorMock.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authServiceMock } = makeSut()
    authServiceMock.accessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  test('Should return 500 if no request is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when no request credential is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when no AuthService are provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when no AuthService has no authenticate method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when no EmailValidator are provided', async () => {
    const authServiceMock = makeAuthService()
    const sut = new LoginRouter(authServiceMock)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when no EmailValidator has no isValid method', async () => {
    const authServiceMock = makeAuthService()
    const sut = new LoginRouter(authServiceMock, {})
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when AuthService throws', async () => {
    const authServiceMock = makeAuthServiceWithError()
    const sut = new LoginRouter(authServiceMock)
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })

  test('Should return 500 when EmailValidator throws', async () => {
    const sut = new LoginRouter(makeAuthService(), makeEmailValidatorWithError())
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new InternalServerError())
  })
})
