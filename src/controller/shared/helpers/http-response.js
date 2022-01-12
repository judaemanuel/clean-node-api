const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')
const InternalServerError = require('./internal-server-error')

module.exports = class HttpResponse {
  static ok (accessToken) {
    return {
      statusCode: 200,
      body: accessToken
    }
  }

  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new InternalServerError()
    }
  }

  static unauthorized () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }
}
