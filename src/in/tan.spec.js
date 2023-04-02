// indiaTAN.test.js

import { InvalidChecksum, InvalidFormat, InvalidLength } from '../exceptions'
import { validate, format } from './tan'

describe('in/tan', () => {
  it('format:ABCDE12345', () => {
    const result = format('ABCDE12345')

    expect(result).toEqual('ABCDE12345')
  })

  it('validate:ABCDE 12345', () => {
    const result = validate('ABCDE 12345')

    expect(result.isValid && result.compact).toEqual('ABCDE12345')
  })

  it('validate:ABCDE1234', () => {
    const result = validate('ABCDE1234')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:12345ABCDE', () => {
    const result = validate('12345ABCDE')

    expect(result.error).toBeInstanceOf(InvalidFormat)
  })

  it('validate:ABCDE12346', () => {
    const result = validate('ABCDE12346')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
