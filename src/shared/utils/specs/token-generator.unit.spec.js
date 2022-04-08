const jwt = require('jsonwebtoken')
const MissingParamError = require('../../global/errors/missing-param-error')
const TokenGenerator = require('../token-generator')

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('Token Generator', () => {
  test('Should return null if JWT returns null', async () => {
    const sut = makeSut()
    jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBeNull()
  })

  test('Should return a token when JWT returns token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(jwt.token)
  })

  test('Should call JWT with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_id')
    expect(jwt.id).toBe('any_id')
    expect(jwt.secret).toBe(sut.secret)
  })

  test('Should throw if no secret is provided', async () => {
    const sut = new TokenGenerator()
    expect(sut.generate('any_id')).rejects.toThrow(new MissingParamError('secret'))
  })

  test('Should throw if no user id is provided', async () => {
    const sut = makeSut()
    expect(sut.generate()).rejects.toThrow(new MissingParamError('user id'))
  })
})
