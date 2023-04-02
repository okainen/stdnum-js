/**
 * PAN (Permanent Account Number, Indian income tax identifier).
 *
 * The Permanent Account Number (PAN) is a 10 digit alphanumeric identifier for
 * Indian individuals, families and corporates for income tax purposes.
 * The number is built up of 5 characters, 4 numbers and 1 character. The fourth
 * character indicates the type of holder of the number and the last character
 * is computed by an undocumented checksum algorithm.
 *
 * Sources:
 *   https://en.wikipedia.org/wiki/Permanent_account_number
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Indian Income Tax Identifier',
  localName: 'Permanent Account Number',
  abbreviation: 'PAN',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return value
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 10) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }
    if (!'ABCFGHLJPTK'.includes(value[3])) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: false,
      isCompany: true,
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
