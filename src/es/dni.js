/**
 * DNI (Documento Nacional de Identidad, Spanish personal identity codes).
 *
 * The DNI is a 9 digit number used to identify Spanish citizens. The last
 * digit is a checksum letter.
 *
 * Foreign nationals, since 2010 are issued an NIE (Número de Identificación
 * de Extranjeros, Foreigner's Identity Number) instead.
 *
 * Sources:
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

const checkDigits = 'TRWAGMYFPDXBNJZSQVHLCKE'

export function calcCheckDigit(value) {
  return checkDigits[parseInt(value.substr(0, 8), 10) % 23]
}

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Spanish Personal Identify Code',
  localName: 'Documento Nacional de Identidad',
  abbreviation: 'DNI',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 8).join('-')
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (value.length !== 9) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }

    const [body, check] = strings.splitAt(value, 8)

    if (!strings.isdigits(body)) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    if (calcCheckDigit(body) !== check) {
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
export default impl
