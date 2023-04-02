/**
 * NTN (Pakistan Tax Identification Number)
 *
 * Pakastan National Identification Number (CNIC) is issued to individuals and legal entities for
 * tax purposes. The number consists of 11 digits.
 *
 * Sources:
 *   https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Pakistan-TIN.pdf
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Pakistani National Tax Number',
  localName: 'National Tax Number',
  abbreviation: 'NTN',

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
    if (value.length !== 7) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
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
