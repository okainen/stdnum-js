/**
 * National Register Number (Numéro de registre national, Rijksregisternummer) of Belgium
 *
 * This number consists of 11 digits. The number is comprised of several parts:
 *
 *   Digits 1 through 6 represent the birth date (YYMMDD),
 *   Digits 7 through 9 represent a serial number,
 *   Digits 10 and 11 are check digits.
 *
 * Sources:
 *   https://fr.wikipedia.org/wiki/Numéro_de_registre_national
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -')
}

const impl = {
  name: 'Belgian National Register Number',
  localName: 'Numéro de registre national / Rijksregisternummer',
  abbreviation: 'NRN',
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
    if (value.length !== 11) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    const birthDate = value.slice(0, 6)
    const serialNumber = value.slice(6, 9)
    const checkDigits = parseInt(value.slice(9, 11), 10)

    const baseValue = parseInt(birthDate + serialNumber, 10)
    const remainder97 = baseValue % 97
    const remainder97Inverted = 97 - remainder97

    if (remainder97Inverted !== checkDigits) {
      // In case the birth year is 2000 or later, the base value is incremented by 2,000,000
      const incrementedBaseValue = baseValue + 2000000
      const incrementedRemainder97 = incrementedBaseValue % 97
      const incrementedRemainder97Inverted = 97 - incrementedRemainder97

      if (incrementedRemainder97Inverted !== checkDigits) {
        return { isValid: false, error: new exceptions.InvalidChecksum() }
      }
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
