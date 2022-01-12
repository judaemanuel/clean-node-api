const MissingParamError = require('./missing-param-error')
const UnauthorizedError = require('./unauthorized-error')
const InternalServerError = require('./internal-server-error')

module.exports = class HttpResponse {
  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static badRequest (error) {
    return {
      statusCode: 400,
      body: new MissingParamError(error)
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