/**
 * Onderwijsnummer (the Dutch student identification number).
 *
 * The onderwijsnummers (education number) is very similar to the BSN (Dutch
 * citizen identification number), but is for students without a BSN. It uses a
 * checksum mechanism similar to the BSN.
 *
 * Sources:
 *   https://nl.wikipedia.org/wiki/Onderwijsnummer
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { weightedSum } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -.')
}

const impl = {
  name: 'Dutch Student Identification Number',
  localName: 'Onderwijsnummer',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 4, 6).join('.')
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
    if (value.substr(0, 2) !== '10') {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const sum = weightedSum(value, {
      weights: [9, 8, 7, 6, 5, 4, 3, 2, -1],
      modulus: 10000,
    })

    if (sum % 11 !== 5) {
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
