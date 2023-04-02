/**
 * Thailand Tax Identification Number (TIN, หมายเลขผู้เสียภาษี).
 *
 * The Thailand TIN is a 13-digit number used to identify taxpayers in Thailand.
 * The last digit of the number is a check digit calculated using the modulus 11 method.
 *
 * Sources:
 *   https://wiki.scn.sap.com/wiki/display/CRM/Thailand
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

function calculateCheckDigit(number) {
  let sum = 0

  for (let i = 0; i < number.length; i += 1) {
    sum += parseInt(number[i], 10) * (13 - i)
  }

  const remainder = sum % 11

  return (11 - remainder) % 10
}

const impl = {
  name: 'Thailand Tax Identification Number',
  localName: 'หมายเลขผู้เสียภาษี',
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

    const checkDigit = calculateCheckDigit(value.substr(0, 12))

    if (parseInt(value[12], 10) !== checkDigit) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: true,
      isCompany: true,
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
