/**
 * Thailand National Identification Number (หมายเลขประจำตัวประชาชน)
 *
 * This number consists of 13 digits. The number is used as a unique identifier for Thai citizens.
 *
 * Sources:
 *   https://th.wikipedia.org/wiki/เลขประจำตัวประชาชนไทย
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings, weightedSum } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Thai National Identification Number',
  localName: 'หมายเลขประจำตัวประชาชน',
  abbreviation: 'NID',
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
    if (value.length !== 13) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const checkDigit = parseInt(value[12], 10)
    const sum = weightedSum(value.slice(0, 12), {
      weights: [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
      modulus: 11,
    })

    const calculatedCheckDigit = sum % 11 <= 1 ? 1 - (sum % 11) : 11 - (sum % 11)

    if (calculatedCheckDigit !== checkDigit) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: true,
      isCompany: false,
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
