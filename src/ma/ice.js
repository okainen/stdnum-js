/**
 * ICE (a Moroccan company establishment identification number).
 *
 * The ICE (Identifiant Commun de l'Entreprises)
 * is a 15 (9 positions for the company, 4 positions for the establishment and 2 control digits), digit number used to identify Moroccan companies' establishments
 * and facilities. The validation checksum is unknown
 *
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  return strings.cleanUnicode(input, ' -/')
}

const impl = {
  name: 'Moroccan Company Establishment Identification Number',
  localName: "Identifiant Commun de l'Entreprises",
  abbreviation: 'ICE',
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
    if (value.length !== 15) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }

    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
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
export default impl
