/**
 * EAN (International Article Number).
 *
 * This handles numbers EAN-13, EAN-8, UPC (12-digit)
 * and GTIN (EAN-14) format.
 */

import * as exceptions from '../exceptions'
import * as strings from '../util/strings'
import { weightedSum } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'International Article Number',
  localName: 'International Article Number',
  abbreviation: 'EAN',
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
    if (![8, 12, 13, 14].includes(value.length)) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const [front, check] = strings.splitAt(value, -1)
    const sum = weightedSum(front, {
      modulus: 10,
      weights: [3, 1],
      reverse: true,
    })

    if (String(10 - sum) !== check) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: false,
      isCompany: false,
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
