import { InvalidChecksum, InvalidFormat, InvalidLength } from '../exceptions'
import { validate, format } from './id'

describe('mt/id', () => {
  it('format:123456M', () => {
    const result = format('123456M')

    expect(result).toEqual('123456M')
  })

  it('validate:123456M', () => {
    const result = validate('123456M')

    expect(result.isValid && result.compact).toEqual('123456M')
  })

  it('validate:12345M', () => {
    const result = validate('12345M')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:1234567', () => {
    const result = validate('1234567')

    expect(result.error).toBeInstanceOf(InvalidFormat)
  })

  it('validate:123456N', () => {
    const result = validate('123456N')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
