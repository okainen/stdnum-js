/**
 * St.-Nr. (Steuernummer, German tax number).
 *
 * The Steuernummer (St.-Nr.) is a tax number assigned by regional tax offices
 * to taxable individuals and organisations. The number is being replaced by the
 * Steuerliche Identifikationsnummer (IdNr).
 * The number has 10 or 11 digits for the regional form (per Bundesland) and 13
 * digits for the number that is unique within Germany. The number consists of
 * (part of) the Bundesfinanzamtsnummer (BUFA-Nr.), a district number, a serial
 * number and a check digit.
 *
 * Source
 *    https://de.wikipedia.org/wiki/Steuernummer
 *
 * PERSON/ENTITY
 */

import * as exceptions from '../exceptions'
import { strings } from '../util'
import nullishlyCoalesce from '../util/nullishlyCoalesce'
// import { mod11mod10Validate } from '../util/checksum';

function clean(input) {
  return strings.cleanUnicode(input, ' -./,')
}

function buildMatch(fmt) {
  const pattern = fmt.replace(/([FBUP])\1*/g, (m) => `(\\d{${m.length}})`)
  const matcher = new RegExp(`^${pattern}$`)

  return (value) => {
    const m = matcher.exec(value)

    if (!m) {
      return { match: false }
    }

    return {
      match: true,
      f: nullishlyCoalesce(m[1], ''),
      b: nullishlyCoalesce(m[2], ''),
      u: nullishlyCoalesce(m[3], ''),
      p: nullishlyCoalesce(m[4], ''),
    }
  }
}

function buildMatcher(rfmt, cfmt) {
  return {
    region: buildMatch(rfmt),
    country: buildMatch(cfmt),
  }
}

const REGION_FORMATS = {
  'DE-BW': buildMatcher('FFBBBUUUUP', '28FF0BBBUUUUP'),
  'DE-BY': buildMatcher('FFFBBBUUUUP', '9FFF0BBBUUUUP'),
  'DE-BE': buildMatcher('FFBBBUUUUP', '11FF0BBBUUUUP'),
  'DE-BB': buildMatcher('0FFBBBUUUUP', '30FF0BBBUUUUP'),
  'DE-HB': buildMatcher('FFBBBUUUUP', '24FF0BBBUUUUP'),
  'DE-HH': buildMatcher('FFBBBUUUUP', '22FF0BBBUUUUP'),
  'DE-HE': buildMatcher('0FFBBBUUUUP', '26FF0BBBUUUUP'),
  'DE-MV': buildMatcher('0FFBBBUUUUP', '40FF0BBBUUUUP'),
  'DE-NI': buildMatcher('FFBBBUUUUP', '23FF0BBBUUUUP'),
  'DE-NW': buildMatcher('FFFBBBBUUUP', '5FFF0BBBBUUUP'),
  'DE-RP': buildMatcher('FFBBBUUUUP', '27FF0BBBUUUUP'),
  'DE-SL': buildMatcher('0FFBBBUUUUP', '10FF0BBBUUUUP'),
  'DE-SN': buildMatcher('2FFBBBUUUUP', '32FF0BBBUUUUP'),
  'DE-ST': buildMatcher('1FFBBBUUUUP', '31FF0BBBUUUUP'),
  'DE-SH': buildMatcher('FFBBBUUUUP', '21FF0BBBUUUUP'),
  'DE-TH': buildMatcher('1FFBBBUUUUP', '41FF0BBBUUUUP'),
}

function findMatch(value) {
  let result = null

  Object.values(REGION_FORMATS).some(({ region, country }) => {
    const rResult = region(value)
    if (rResult.match) {
      result = rResult

      return true
    }
    const cResult = country(value)
    if (cResult.match) {
      result = cResult

      return true
    }

    return false
  })

  return result
}

const impl = {
  name: 'German Tax Number',
  localName: 'Steuernummer',
  abbreviation: ' St.-Nr.',
  compact(input) {
    const [value, err] = clean(input)

    if (err) {
      throw err
    }

    return value
  },

  format(input) {
    const [value] = clean(input)

    const match = findMatch(input)

    if (!match || !match.match) {
      return value
    }

    return `${match.f}/${match.b}/${match.u} ${match.p}`
  },

  validate(input) {
    const [value, error] = clean(input)

    if (error) {
      return { isValid: false, error }
    }
    if (![10, 11, 13].includes(value.length)) {
      return { isValid: false, error: new exceptions.InvalidLength() }
    }
    if (!strings.isdigits(value)) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    // Make sure it's the same as a region
    if (findMatch(value) === null) {
      return { isValid: false, error: new exceptions.InvalidFormat() }
    }

    // In the first 10 digits exactly one digit must be repeated two or
    // three times and other digits can appear only once.
    // Starting at 2017, the rule is, that within the first ten digits one number has to
    // appear exactly twice or thrice.
    const counter = {}

    value
      .substring(0, 10)
      .split('')
      .forEach((v) => {
        counter[v] = nullishlyCoalesce(counter[v], 0) + 1
      })
    const more = Object.values(counter)
    if (!more.some((v) => v === 2 || v === 3)) {
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
export default impl
