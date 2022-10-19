import { validate, format } from './ban'
import { InvalidLength, InvalidFormat } from '../exceptions'

describe('tw/ui', () => {
  it('format:00501-50 3', () => {
    const result = format('00501-50 3')

    expect(result).toEqual('00501503')
  })

  it('validate:A800501503', () => {
    const result = validate('A800501503')

    expect(result.isValid && result.compact).toEqual('A800501503')
  })

  it('validate:12345', () => {
    const result = validate('12345')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:12345AAAAA', () => {
    const result = validate('12345AAAAA')

    expect(result.error).toBeInstanceOf(InvalidFormat)
  })
})
