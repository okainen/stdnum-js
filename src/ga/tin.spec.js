import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './tin'

describe('ga/tin', () => {
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

  it('validate:12345678912', () => {
    const result = validate('12345678912')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
