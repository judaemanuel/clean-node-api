const HttpResponse = require('../../shared/helpers/http-response')
const InvalidParamError = require('../../shared/helpers/invalid-param-error')
const MissingParamError = require('../../shared/helpers/missing-param-error')

module.exports = class LoginRouter {
  constructor (authService, emailValidator) {
    this.authService = authService
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }
      const accessToken = await this.authService.authenticate(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorized()
      }
      return HttpResponse.ok({ accessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
