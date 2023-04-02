import { InvalidFormat, InvalidLength } from '../exceptions'
import { validate, format } from './fprcn'

describe('cn/fprcn', () => {
  it('format:810000199112301234', () => {
    const result = format('810000199112301234')

    expect(result).toEqual('810000 1991 1230 1234')
  })

  it('validate:810000 1991 1230 1234', () => {
    const result = validate('810000 1991 1230 1234')

    expect(result.isValid && result.compact).toEqual('810000199112301234')
  })

  it('validate:81000019911230123', () => {
    const result = validate('81000019911230123')

    expect(result.error).toBeInstanceOf(InvalidLength)
  })

  it('validate:910000199112301234', () => {
    const result = validate('910000199112301234')

    expect(result.error).toBeInstanceOf(InvalidFormat)
  })
})
