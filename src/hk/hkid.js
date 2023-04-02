/**
 * HKID (Hong Kong Identity Card).
 *
 * The standard format of HKID number is @ 123456(#).
 *   (a) @ represents any one or two capital letters of the alphabet.
 *   (b) # is the check digit which has 11 possible values from 0 to 9 and A.
 *
 * All the letters and numerals of the HKID number, including the check digit without the bracket, are used
 * as the identifier equivalent to TIN for individuals.
 *
 * Sources:
 *   https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Hong-Kong-TIN.pdf
 *   http://www.immd.gov.hk/eng/services/hkid/general_info.html
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { weightedSum } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -()')
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const impl = {
  name: 'Hong Kong Identity Card Number',
  localName: '香港身份證',
  abbreviation: 'HKID',
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
    if (value.length !== 8 && value.length !== 9) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!/^[A-NP-Z]{1,2}[0-9]{6}[0-9A]$/.test(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const [front, check] = strings.splitAt(value, -1)

    const sum =
      (weightedSum(front, {
        modulus: 11,
        weights:
          front.length === 7
            ? [8, 7, 6, 5, 4, 3, 2, 1]
            : [9, 8, 7, 6, 5, 4, 3, 2, 1],
        alphabet,
      }) +
        (front.length === 7 ? 5 : 0)) %
      11

    if (alphabet[(11 - sum) % 11] !== check) {
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
