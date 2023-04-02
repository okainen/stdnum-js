import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './nid'

describe('th/nin', () => {
  it('format:1234567890123', () => {
    const result = format('1234567890123')

    expect(result).toEqual('1-2345-67890-12-3')
  })

  it('validate:1-2345-67890-12-3', () => {
    const result = validate('1-2345-67890-12-3')

    expect(result.isValid && result.compact).toEqual('1234567890123')
  })

  it('validate:12345678901234', () => {
    const result = validate('12345678901234')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:9-8765-43210-98-7', () => {
    const result = validate('9-8765-43210-98-7')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
