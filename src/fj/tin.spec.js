import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './tin'

describe('fj/tin', () => {
  it('format:123456789', () => {
    const result = format('123456789')

    expect(result).toEqual('123456789')
  })

  it('validate:123456789', () => {
    const result = validate('123456789')

    expect(result.isValid && result.compact).toEqual('123456789')
  })

  it('validate:12345678', () => {
    const result = validate('12345678')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:123456790', () => {
    const result = validate('123456790')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
