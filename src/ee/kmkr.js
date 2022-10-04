/**
 * KMKR (Käibemaksukohuslase, Estonian VAT number).
 *
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { weightedSum } from '../util/checksum'

function clean(input) {
  const [value, err] = strings.cleanUnicode(input, ' ')
  if (err !== null) {
    return [value, err]
  }
  if (value.startsWith('EE')) {
    return [value.substr(2), null]
  }
  return [value, null]
}

const impl = {
  name: 'Estronian VAT Number',
  localName: 'Käibemaksukohuslase',
  abbreviation: 'KMKR',
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

    const [front, check] = strings.splitAt(value, -1)

    const sum = weightedSum(front, {
      modulus: 10,
      weights: [3, 7, 1],
    })

    if (String((10 - sum) % 10) !== check) {
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
