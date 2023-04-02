/**
 * RNC (Registro Nacional del Contribuyente, Dominican Republic tax number).
 *
 * The RNC is the Dominican Republic taxpayer registration number for
 * institutions. The number consists of 9 digits.
 *
 * Sources:
 *
 * TAX ENTITY
 */

import * as exceptions from '../exceptions'
import { strings, weightedSum } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Dominican Republic Tax Number',
  localName: 'Registro Nacional del Contribuyente',
  abbreviation: 'RNC',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 1, 3, -1).join('-')
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

    const [front, check] = strings.splitAt(value, 8)

    const sum = weightedSum(front, {
      weights: [7, 9, 8, 6, 5, 4, 3, 2],
      modulus: 11,
    })

    if (String(((10 - sum) % 9) + 1) !== check) {
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
