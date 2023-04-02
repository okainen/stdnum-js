/**
 * Hong Kong Business Registration Number
 *
 * This number consists of 8 characters. The number is comprised of several parts:
 *   Characters 1 through 7 represent the numeric code,
 *   Character 8 is an alphabetic check character.
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Hong Kong Business Registration Number',
  localName: '香港商業登記證號',
  abbreviation: 'BRN',
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
    if (value.length !== 8) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }

    const numericPart = value.slice(0, 7)
    const checkChar = value.slice(7)

    if (!strings.isdigits(numericPart) || !strings.isalpha(checkChar)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const sum = numericPart.split('').reduce((acc, curr, idx) => acc + parseInt(curr, 10) * (idx + 2), 0)

    const checkValue = (sum % 11 === 0) ? 0 : 11 - (sum % 11)
    const checkDigit = (checkValue === 10) ? 'A' : checkValue.toString()

    if (checkDigit !== checkChar) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
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
