/**
 * n° TVA (taxe sur la valeur ajoutée, Monacan VAT number).
 *
 * For VAT purposes Monaco is treated as territory of France. The number is
 * also validated the same as the French TVA, except that it is not based on
 * a French SIREN.
 *
 * Sources:
 *
 * ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { validate as frValidate } from '../fr/tva'

function clean(input) {
  return strings.cleanUnicode(input, ' ', 'FR')
}

const impl = {
  name: 'Monacan VAT Number',
  localName: "Numéro d'Identification à la Taxe sur la Valeur Ajoutée",
  abbreviation: 'n° TVA',
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

    const r = frValidate(value)
    if (!r.isValid) {
      return r
    }
    if (value.substr(2, 3) !== '000') {
      return { isValid: false, error: new exceptions.InvalidComponent() }
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
