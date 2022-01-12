const HttpResponse = require('../../shared/helpers/http-response')
const MissingParamError = require('../../shared/helpers/missing-param-error')

module.exports = class LoginRouter {
  constructor (authService) {
    this.authService = authService
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      // if(!/email/.test(email)){
      //   return HttpResponse.badRequest('email',)
      // }
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
