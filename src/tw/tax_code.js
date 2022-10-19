/**
 * Tax Code
 *
 * Individual taxpayers who have neither National ID Card Number nor UI Number
 * (usually because they were not physically present or only stayed for a short
 * period of time in the R.O.C.) may produce Tax Codes themselves as their TINs
 * by reference to the coding princip
 *
 * Sources:
 *   https://www.mof.gov.tw/Eng/download/16968
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Tax Code',

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
    if (value.length === 10) {
      if (!strings.isalpha(value.substring(9))) {
        return { isValid: false, error: new exceptions.InvalidFormat() }
      }
      if (!strings.isdigits(value.substring(0, 9))) {
        return { isValid: false, error: new exceptions.InvalidFormat() }
      }
      return {
        isValid: true,
        compact: value,
        isIndividual: true,
        isCompany: false,
      }
    }
    if (value.length === 7) {
      if (value[0] !== '9') {
        return { isValid: false, error: new exceptions.InvalidFormat() }
      }
      if (!strings.isdigits(value.substring(1))) {
        return { isValid: false, error: new exceptions.InvalidFormat() }
      }
      return {
        isValid: true,
        compact: value,
        isIndividual: true,
        isCompany: false,
      }
    }
    return { isValid: false, error: new exceptions.InvalidLength() }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
export default impl
