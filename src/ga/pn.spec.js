import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './pn'

describe('ga/personalNumber', () => {
  it('format:01018001000', () => {
    const result = format('01018001000')

    expect(result).toEqual('01018001000')
  })

  it('validate:01018001000', () => {
    const result = validate('01018001000')

    expect(result.isValid && result.compact).toEqual('01018001000')
  })

  it('validate:0101800100', () => {
    const result = validate('0101800100')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:01018001001', () => {
    const result = validate('01018001001')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
