module.exports = class InternalServerError extends Error {
  constructor () {
    super('An error has ocurred, try again later')
    this.name = 'InternalServerError'
  }
}
