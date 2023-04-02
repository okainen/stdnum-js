/**
 * Swiss social security number ("Sozialversicherungsnummer").
 *
 * Also known as "Neue AHV Nummer". The Swiss Sozialversicherungsnummer is used
 * to identify individuals for taxation and pension purposes.
 * The number is validated using EAN-13, though dashes are substituted for dots.
 *
 * Sources:
 *   https://en.wikipedia.org/wiki/National_identification_number#Switzerland
 *   https://de.wikipedia.org/wiki/Sozialversicherungsnummer#Versichertennummer
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { ean } from '../gen'

function clean(input) {
  return strings.cleanUnicode(input, ' -.')
}

const impl = {
  name: 'Swiss Social Security Number',
  localName: 'Sozialversicherungsnummer',
  abbreviation: 'SSN',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return strings.splitAt(value, 3, 7, 11).join('.')
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
    if (!value.startsWith('756')) {
      return { isValid: false, error: new exceptions.InvalidComponent() }
    }

    if (!ean.validate(value).isValid) {
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
