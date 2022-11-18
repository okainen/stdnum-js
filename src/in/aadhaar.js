/**
 * Aadhaar (Indian digital resident personal identity number)
 *
 * Aadhaar is a 12 digit unique identity number issued to all Indian residents.
 * The number is assigned by the Unique Identification Authority of India
 * (UIDAI).
 *
 * Source
 *    https://en.wikipedia.org/wiki/Aadhaar
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { verhoeffValidate } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Indian Digital Resident Personal Identity Number',
  localName: 'Aadhaar',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 4, 8).join(' ')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 12) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }
    if (value[0] === '0' || value[0] === '1') {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!verhoeffValidate(value)) {
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
