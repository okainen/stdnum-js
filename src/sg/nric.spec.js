// singaporeNRIC.test.js

import { InvalidChecksum, InvalidFormat, InvalidLength } from '../exceptions'
import { validate, format } from './nric'

describe('sg/nric', () => {
  it('format:S1234567D', () => {
    const result = format('S1234567D')

    expect(result).toEqual('S1234567D')
  })

  it('validate:S1234567D', () => {
    const result = validate('S1234567D')

    expect(result.isValid && result.compact).toEqual('S1234567D')
  })

  it('validate:S123456D', () => {
    const result = validate('S123456D')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:1234567D', () => {
    const result = validate('1234567D')

    expect(result.error).toBeInstanceOf(InvalidFormat)
  })

  it('validate:S1234567E', () => {
    const result = validate('S1234567E')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
