/**
 * Identity Number (Mispar Zehut, מספר זהות, Israeli identity number).
 *
* The identity number (Mispar Zehut, מספר זהות) is issued at birth to Israeli
* citizens. The number consists of nine digits and includes a check digit.

* Sources:
*   https://en.wikipedia.org/wiki/National_identification_number#Israel
*   https://en.wikipedia.org/wiki/Israeli_identity_card
*   https://he.wikipedia.org/wiki/מספר_זהות_(ישראל)
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { luhnChecksumValidate } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Israeli Identify Number',
  localName: 'Mispar Zehut, מספר זהות',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, -1).join('-')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length > 9) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!luhnChecksumValidate(value.padStart(9, '0'))) {
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
  name, localName, validate, format, compact,
} = impl
