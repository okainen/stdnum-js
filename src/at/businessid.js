/**
 * Austrian Company Register Numbers.
 *
 * Sources:
 *
 * ENTITY
 *
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'

function clean(input) {
  const [value, err] = strings.cleanUnicode(input, ' -./')

  if (err) {
    return [value, err]
  }

  if (value.startsWith('FN')) {
    return [value.substring(2), null]
  }

  return [value, null]
}

const impl = {
  name: 'Austrian Company Register Number',
  localName: 'Company Register Number',
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

  /**
   * Check if the number is a valid Business ID number.
   * This checks the length, formatting and other contraints. It does not check
   * for control letter.
   */
  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (!/^\d+[A-Z]$/.test(value)) {
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
