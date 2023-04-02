/**
 * New Zealand Business Number (NZBN).
 *
 * The New Zealand Business Number is a 13-digit number based on the global GS1 standard.
 * It is used to identify businesses in New Zealand.
 *
 * Sources:
 *   https://www.nzbn.govt.nz/
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

function calculateChecksum(digits) {
  let sum = 0
  for (let i = 0; i < digits.length; i += 1) {
    const digit = digits[i]
    const weight = i % 2 === 0 ? 1 : 3
    sum += digit * weight
  }
  const remainder = sum % 10
  return remainder === 0 ? 0 : 10 - remainder
}

const impl = {
  name: 'New Zealand Business Number',
  localName: 'NZBN',
  abbreviation: 'NZBN',
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
    if (value.length !== 13) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const digits = value.split('').map(Number)
    const baseCheckDigit = digits.pop()
    const checkDigit = calculateChecksum(digits)

    if (checkDigit !== baseCheckDigit) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
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
