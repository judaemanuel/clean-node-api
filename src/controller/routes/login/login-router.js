const HttpResponse = require('../../shared/helpers/http-response')

module.exports = class LoginRouter {
  constructor (authService) {
    this.authService = authService
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    this.authService.authenticate(email, password)
  }
}
