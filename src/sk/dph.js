/**
 * IČ DPH (IČ pre daň z pridanej hodnoty, Slovak VAT number).
 *
 * The IČ DPH (Identifikačné číslo pre daň z pridanej hodnoty) is a 10-digit
 * number used for VAT purposes. It has a straightforward checksum.
 *
 * Sources:
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -', 'SK')
}

const impl = {
  name: 'Slovak VAT Number',
  localName: 'Identifikačné Číslo pre Daň z Pridanej Hodnoty',
  abbreviation: 'IČ DPH',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 3, 6, 8).join(' ')
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

    if (!'234789'.includes(value[0])) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    if (parseInt(value, 10) % 11 !== 0) {
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
