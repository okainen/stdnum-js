/**
 * PIB (Poreski Identifikacioni Broj, Serbian tax identification number).
 *
 * The Serbian tax identification number consists of 9 digits where the last
 * digit is a check digit.
 *
 * Sources:
 *   https://en.wikipedia.org/wiki/VAT_identification_number
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { mod11mod10Validate } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -.', 'RS')
}

const impl = {
  name: 'Serbian Tax Identification Number',
  localName: 'Poreski Identifikacioni Broj',
  abbreviation: 'PIB',
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

    if (!mod11mod10Validate(value)) {
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
