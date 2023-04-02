/**
 * Tax Deduction and Collection Account Number (TAN) of India
 *
 * This number consists of 10 characters. The number is comprised of several parts:
 *
 *   Characters 1 through 4 represent the alphabetic code,
 *   Characters 5 through 9 represent the numeric code,
 *   Character 10 is an alphabetic check character.
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Indian Tax Deduction and Collection Account Number',
  localName: 'भारतीय कर कटौती और संग्रह खाता संख्या',
  abbreviation: 'TAN',
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

    const alphaPart = value.slice(0, 4)
    const numericPart = value.slice(4, 9)
    const checkChar = value.slice(9)

    if (!strings.isalpha(alphaPart)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!strings.isdigits(numericPart)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!strings.isalpha(checkChar)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
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
