const jwt = require('jsonwebtoken')
const MissingParamError = require('../../global/errors/missing-param-error')
const TokenGenerator = require('../token-generator')

const makeSut = () => {
  return new TokenGenerator()
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return a token when ...', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('Should throw if no params are provided', async () => {
    const sut = makeSut()
    expect(sut.generate()).rejects.toThrow(new MissingParamError('user id'))
  })
})
