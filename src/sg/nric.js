/**
 * National Registration Identity Card (NRIC) of Singapore
 *
 * The NRIC is a unique identifier assigned to Singapore citizens and permanent residents.
 * It consists of a prefix letter ('S', 'T', 'F', or 'G'), followed by 7 digits and a checksum
 * letter. The checksum is calculated using a specific weighting algorithm.
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -.')
}

function calculateChecksum(value, weights, letters) {
  const sum = weights.reduce(
    (acc, weight, index) => acc + weight * parseInt(value.charAt(index), 10),
    0,
  )

  const remainder = sum % 11
  return letters.charAt(11 - remainder)
}

const impl = {
  name: 'Singapore National Registration Identity Card',
  localName: 'National Registration Identity Card',
  abbreviation: 'NRIC',
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
    if (!/^[STFG]\d{7}[A-Z]$/.test(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const prefix = value.charAt(0)
    const digits = value.slice(1, 8)
    const checksumLetter = value.charAt(8)
    const weights = [2, 7, 6, 5, 4, 3, 2]

    let letters
    if (prefix === 'S' || prefix === 'T') {
      letters = 'JZIHGFEDCBA'
    } else if (prefix === 'F' || prefix === 'G') {
      letters = 'XWUTRQPNMLK'
    } else {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    const expectedChecksumLetter = calculateChecksum(digits, weights, letters)

    if (checksumLetter !== expectedChecksumLetter) {
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
