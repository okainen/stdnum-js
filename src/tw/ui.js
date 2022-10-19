/**
 * UI Number
 *
 * The UI Number is shown on the “R.O.C. (Taiwan) Resident Certificate,” “Exit &
 * Entry Permit Taiwan Republic of China,” or the “R.O.C. (Taiwan) UI No. Basic
 * Information Form.”
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
  name: 'UI Number',
  abbreviation: 'UI',

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
    if (!strings.isalpha(value[0])) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }
    if (!['A', 'B', 'C', 'D'].includes(value[1]) && !['8', '9'].includes(value[1])) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }
    if (!strings.isdigits(value.substring(2))) {
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
export default impl
