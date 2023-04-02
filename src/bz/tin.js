/**
 * TIN (Belize Tax ID)
 *
 * Sources:
 *   https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Belize-TIN.pdf
 *
 * PERSON/ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Belize Tax Identification Number',
  localName: 'Tax Identification Number',
  abbreviation: 'TIN',

  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 6).join('-')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 6 && value.length !== 8) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }
    const [, code] = strings.splitAt(value, 6)

    if (code && !['10', '13', '66'].includes(code)) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: code === '10',
      isCompany: code === '13' || code === '66',
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
