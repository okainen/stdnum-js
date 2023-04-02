/**
 * T.C. Kimlik No. (Turkish personal identification number)
 *
 * The Turkish Identification Number (Türkiye Cumhuriyeti Kimlik Numarası) is a
 * unique personal identification number assigned to every citizen of Turkey.
 * The number consists of 11 digits and the last two digits are check digits.
 *
 * Sources:
 *   https://en.wikipedia.org/wiki/Turkish_Identification_Number
 *   https://tckimlik.nvi.gov.tr/
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings, weightedSum } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, '')
}

const impl = {
  name: 'Turkish Identificatio Number',
  localName: 'Türkiye Cumhuriyeti Kimlik Numarası',
  abbreviation: 'T.C. Kimlik No.',
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
    if (!strings.isdigits(value) || value[0] === '0') {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const [front, check] = strings.splitAt(value, -2)

    const sum1 =
      10 -
      weightedSum(front, {
        weights: [3, 1],
        modulus: 10,
      })
    const sum2 =
      (sum1 +
        weightedSum(front, {
          weights: [1],
          modulus: 10,
        })) %
      10

    if (`${sum1}${sum2}` !== check) {
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
