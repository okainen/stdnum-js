/**
 * Foreigner's Permanent Residence Card Number of China
 *
 * This number consists of 15 digits. The number is comprised of several parts:
 *
 *   Digits 1 through 3 represent the nationality code,
 *   Digits 4 through 7 represent the birth year,
 *   Digits 8 through 9 represent the birth month,
 *   Digits 10 through 11 represent the birth date,
 *   Digits 12 through 15 are a unique sequence number.
 *
 * The nationality code corresponds to the ISO 3166-1 numeric-3 country codes.
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: "Chinese Foreigner's Permanent Residence Card Number",
  localName: '中国外国人永久居留身份证号码',
  abbreviation: 'FPRCN',
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
    if (value.length !== 15) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const year = parseInt(value.slice(3, 7), 10)
    const month = parseInt(value.slice(7, 9), 10)
    const day = parseInt(value.slice(9, 11), 10)

    if (year < 1900 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
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
