import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './tin'

describe('th/tin', () => {
  it('format:1234567890123', () => {
    const result = format('1234567890123')

    expect(result).toEqual('123-456-789-012-3')
  })

  it('validate:123-456-789-012-3', () => {
    const result = validate('123-456-789-012-3')

    expect(result.isValid && result.compact).toEqual('1234567890123')
  })

  it('validate:12345678901234', () => {
    const result = validate('12345678901234')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:987-654-321-019-8', () => {
    const result = validate('987-654-321-019-8')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
