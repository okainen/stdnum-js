import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './brn'

describe('hk/brn', () => {
  it('format:12345678', () => {
    const result = format('12345678')

    expect(result).toEqual('12345678')
  })

  it('validate:12345678', () => {
    const result = validate('12345678')

    expect(result.isValid && result.compact).toEqual('12345678')
  })

  it('validate:1234567', () => {
    const result = validate('1234567')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:87654321', () => {
    const result = validate('87654321')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
