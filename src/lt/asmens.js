/**
 * Asmens kodas (Lithuanian, personal numbers).
 *
 * The Asmens kodas consists of 11 digits. The first digits denotes the gender
 * and birth century, the second through seventh denotes the birth date,
 * followed by a three-digit serial and a check digit.
 *
 * Sources:
 *   https://lt.wikipedia.org/wiki/Asmens_kodas
 *   https://en.wikipedia.org/wiki/National_identification_number#Lithuania
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { ikCheck, ikCheckDate } from '../ee/ik'

function clean(input) {
  return strings.cleanUnicode(input, ' -/')
}

const impl = {
  name: 'Lithuanian Personal Code',
  localName: 'Asmens Kodas',
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
    if (value.length !== 11) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (value[0] !== '9' && !ikCheckDate(value)) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }
    if (!ikCheck(value)) {
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
