import { InvalidChecksum, InvalidLength } from '../exceptions'
import { validate, format } from './nzbn'

describe('nz/bn', () => {
  it('format:9429034581661', () => {
    const result = format('9429034581661')

    expect(result).toEqual('9429-0345-8166-1')
  })

  it('validate:9429-0345-8166-1', () => {
    const result = validate('9429-0345-8166-1')

    expect(result.isValid && result.compact).toEqual('9429034581661')
  })

  it('validate:94290345816612', () => {
    const result = validate('94290345816612')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:9429034581662', () => {
    const result = validate('9429034581662')

    expect(result.error).toBeInstanceOf(InvalidChecksum)
  })
})
