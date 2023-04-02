/**
 * TIN (South African Tax Identification Number).
 *
 * The South African Tax Identification Number (TIN or Tax Reference Number) is
 * issued to individuals and legal entities for tax purposes. The number
 * consists of 10 digits.
 *
 * Sources:
 *   https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/South-Africa-TIN.pdf
 *   https://www.sars.gov.za/
 *
 * PERSON/ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { luhnChecksumValidate } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -/')
}

const impl = {
  name: 'South African Tax Identification Number',
  localName: 'Tax Identification Number',
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
    if (value.length !== 10) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!'01239'.includes(value[0])) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!luhnChecksumValidate(value)) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
    }

    return {
      isValid: true,
      compact: value,
      isIndividual: true, // TIN can be either. cannot determine
      isCompany: true, // TIN can be either. cannot determine
    }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
