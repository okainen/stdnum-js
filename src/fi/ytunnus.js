/**
 * Y-tunnus (Finnish business identifier).
 *
 *  The number is an 8-digit code with a weighted checksum.
 *
 * ENTITY
 */

import { strings } from '../util'
import { validate as alvValidate } from './alv'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Finnish Business Identifier',
  localName: 'Yritys- ja yhteisötunnus',
  abbreviation: 'Y-tunnus',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, -1).join('-')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }

    return alvValidate(value)
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
