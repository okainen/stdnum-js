/**
 * CIF (Cod de înregistrare în scopuri de TVA, Romanian VAT number).
 *
 * The Romanian CIF is used for VAT purposes and can be from 2 to 10 digits long.
 *
 * PERSON/ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { validate as cnpValidate } from './cnp'
import { validate as cuiValidate, format as cuiFormat } from './cui'

function clean(input) {
  return strings.cleanUnicode(input, ' -', 'RO')
}

const impl = {
  name: 'Romanian VAT Number',
  localName: 'Codul de Identificare Fiscală',
  abbreviation: 'CIF',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    return cuiFormat(value)
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (value.length === 13) {
      // apparently a CNP can also be used (however, not all sources agree)
      return cnpValidate(value)
    }
    if (value.length >= 2 && value.length <= 10) {
      return cuiValidate(value)
    }

    return { isValid: false, error: new exceptions.InvalidLength() }
  },
}

export const {
  name, localName, abbreviation, validate, format, compact,
} = impl
