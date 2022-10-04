/**
 * The National Insurance Number (NINO) is a nine character identifier used in
 * the United Kingdom.
 *
 * The first two characters are from an approved list of prefixes, the next
 * six characters are numbers issued sequentially and the final character is
 * a letter A-D. The suffix may be omitted if it is not known.
 *
 * Source
 *  https://en.wikipedia.org/wiki/National_Insurance_number
 *
 * PERSON
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import PREFIXES from './nino-prefixes'

function clean(input) {
  return strings.cleanUnicode(input, ' -.')
}

function validLength(value) {
  // The suffix letter may be omitted, so we permit a length of 8.
  return [8, 9].includes(value.length)
}

const VALID_FORMAT_REGEX = /^([A-Z]{2})\d{6}[A-D]?$/

function validFormat(value) {
  const matchData = value.toUpperCase().match(VALID_FORMAT_REGEX)
  return !!matchData && PREFIXES.has(matchData[1])
}

const impl = {
  name: 'United Kingdom National Insurance Number',
  localName: 'National Insurance Number',
  abbreviation: 'NINO',

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
    if (!validLength(value)) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!validFormat(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
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
