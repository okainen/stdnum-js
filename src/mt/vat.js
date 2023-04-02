/**
 * Maltese VAT Number
 *
 * Sources:
 *   https://www.oecd.org/tax/automatic-exchange/crs-implementation-and-assistance/tax-identification-numbers/Malta-TIN.pdf
 *   https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/395616/ESL-Foreign-Language-Letter-Malta.pdf
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { weightedSum } from '../util/checksum'

function clean(input) {
  return strings.cleanUnicode(input, ' -', 'MT')
}

const impl = {
  name: 'Maltese VAT Number',
  localName: 'Vat Reg. No.',
  abbreviation: 'Vat No.',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 4).join('-')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 8) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const sum = weightedSum(value, {
      weights: [3, 4, 6, 7, 8, 9, 10, 1],
      modulus: 37,
    })
    if (sum !== 0) {
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
