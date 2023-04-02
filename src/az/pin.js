/**
 *  PIN - Fərdi İdentifikasiya Nömrəsidir (Azerbaijani Personal Identification Number).
 *
 * Sources:
 *   https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Azerbaijan-TIN.pdf
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' ')
}

const impl = {
  name: 'Azerbaijani Personal Identification Number',
  localName: 'Fərdi İdentifikasiya Nömrəsidir',
  abbreviation: 'PIN',
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
