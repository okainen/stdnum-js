/**
 * ACN (Australian Company Number).
 *
 * The Australian Company Number (ACN) is a company identifier issued by the
 * Australian Securities and Investments Commission.
 *
 * Sources:
 *   https://en.wikipedia.org/wiki/Australian_Company_Number
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { weightedSum } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' ')
}

const impl = {
  name: 'Australian Company Number',
  localName: 'Company Number',
  abbreviation: 'ACN',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 3, 6).join(' ')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 9) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const [front, check] = strings.splitAt(value, -1)

    const sum = weightedSum(front, {
      weights: [-8, -7, -6, -5, -4, -3, -2, -1],
      modulus: 10,
    })

    if (String(sum) !== check) {
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
