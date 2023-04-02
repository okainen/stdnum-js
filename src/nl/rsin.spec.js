import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './rsin'

describe('nl/rsin', () => {
  it('format:123456789', () => {
    const result = format('123456789')

    expect(result).toEqual('123456789')
  })

  it('validate:123456789', () => {
    const result = validate('123456789')

    expect(result.isValid && result.compact).toEqual('123456789')
  })

  it('validate:1234567890', () => {
    const result = validate('1234567890')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:987654321', () => {
    const result = validate('987654321')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
