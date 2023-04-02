/**
 * NIP (Numer Identyfikacji Podatkowej, Polish VAT number).
 *
 * The NIP (Numer Identyfikacji Podatkowej) number consists of 10 digit with
 * a straightforward weighted checksum.
 *
 * Sources:
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { weightedSum } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -', 'PL')
}

const impl = {
  name: 'Polish VAT Number',
  localName: 'Numer Identyfikacji Podatkowej',
  abbreviation: 'NIP',
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
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const sum = weightedSum(value, {
      weights: [6, 5, 7, 2, 3, 4, 5, 6, 7, -1],
      modulus: 11,
    })

    if (sum !== 0) {
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
