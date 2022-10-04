/**
 * The Belgian national number is a unique identifier consisting of 11 digits.
 *
 * Source
 *  https://fr.wikipedia.org/wiki/Numéro_de_registre_national
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import { validStructure, validChecksum } from './personIdentifierHelpers'

function clean(input) {
  return strings.cleanUnicode(input, ' -.')
}

export function compact(input) {
  const [value, err] = clean(input)

  if (err) {
    throw err
  }

  return value
}

const impl = {
  name: 'Belgian National Number',
  localName: 'Numéro National',
  abbreviation: 'NN, RN',
  format(input) {
    const [value] = clean(input)
    return value
  },
  validate(input) {
    const number = impl.compact(input)

    if (!strings.isdigits(number) || parseInt(number, 10) <= 0) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (number.length !== 11) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }

    if (!validStructure(number)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    if (!validChecksum(number)) {
      return { isValid: false, error: new exceptions.InvalidChecksum() }
    }

    return {
      isValid: true,
      compact,
      isIndividual: true,
      isCompany: false,
    }
  },
}

export const {
  name, localName, abbreviation, validate, format,
} = impl
