/**
 * Rechtspersonen en Samenwerkingsverbanden Informatienummer (RSIN, Legal Entities and Partnerships Information Number) of the Netherlands
 *
 * This number consists of 9 digits. It is a unique identifier for legal entities and partnerships in the Netherlands.
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings, weightedSum } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Dutch Legal Entities and Partnerships Information Number',
  localName: 'Rechtspersonen en Samenwerkingsverbanden Informatienummer',
  abbreviation: 'RSIN',
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
    if (value.length !== 9) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const sum = weightedSum(value, {
      weights: [9, 8, 7, 6, 5, 4, 3, 2],
      modulus: 11,
    })

    if (sum % 11 !== 0) {
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
