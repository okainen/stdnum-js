/**
 * UBN (Unified Business Number, 統一編號, Taiwanese tax number).
 *
 * The Unified Business Number (UBN, 統一編號) is the number assigned to businesses
 * within Taiwan for tax (VAT) purposes. The number consists of 8 digits, the
 * last being a check digit.
 *
 * Sources:
 *   https://zh.wikipedia.org/wiki/統一編號
 *   https://findbiz.nat.gov.tw/fts/query/QueryBar/queryInit.do?request_locale=en
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Taiwanese Unified Business Number',
  localName: '統一編號',
  abbreviation: 'UBN',

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
    if (value.length !== 8) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const weights = [1, 2, 1, 2, 1, 2, 4, 1]

    const digits = weights
      .map((w, idx) => String(parseInt(value[idx], 10) * w))
      .join('')
    const sum = digits
      .split('')
      .reduce((acc, d) => (acc + parseInt(d, 10)) % 10, 0)

    if (!(sum === 0 || (sum === 9 && value[6] === '7'))) {
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
