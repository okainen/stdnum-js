import { strings, isValidDateCompactYYYYMMDD } from '../util'

function getApproximatelyNow() {
  const ONE_DAY = 1000 * 60 * 60 * 24
  return new Date(Date.now() + ONE_DAY)
}

function isInPast(date) {
  return new Date(`${date}`) <= getApproximatelyNow()
}

function getFullYears(yy) {
  return [parseInt(`19${yy}`, 10), parseInt(`20${yy}`, 10)]
}

function getFirstSix(number) {
  return strings.splitAt(number, 6)[0]
}

function getBaseNumber(number) {
  return strings.splitAt(number, 9)[0]
}

function getChecksum(number) {
  const checksumString = strings.splitAt(number, 9)[1]
  return parseInt(checksumString, 10)
}

export function toDateArray(number) {
  return strings.splitAt(number, 2, 4, 6).slice(0, 3)
}

function getValidPastDates(yymmdd) {
  const [yy, mm, dd] = toDateArray(yymmdd)
  return getFullYears(yy)
    .filter((yyyy) => isValidDateCompactYYYYMMDD(`${yyyy}${mm}${dd}`))
    .map((yyyy) => `${yyyy}-${mm}-${dd}`)
    .filter(isInPast)
}

function isUnknownDob(dob) {
  const [yy, mm, dd] = toDateArray(dob)
  return strings.isdigits(yy) && mm === '00' && strings.isdigits(dd)
}

function toChecksumBasis(year, baseNumber) {
  return parseInt(year < 2000 ? baseNumber : `${2}${baseNumber}`, 10)
}

function isValidDob(dob) {
  return Boolean(getValidPastDates(dob).length)
}

function defaultToDob(origFirstSix) {
  return origFirstSix
}

function isValidFirstSix(firstSix, toDob) {
  const dob = toDob(firstSix)
  return isUnknownDob(dob) || isValidDob(dob)
}

export function validStructure(number, toDob = defaultToDob) {
  const firstSix = getFirstSix(number)
  return isValidFirstSix(firstSix, toDob)
}

function getChecksumBasesUnknownDob(baseNumber) {
  const firstSix = getFirstSix(baseNumber)
  const [yy] = toDateArray(firstSix)

  return getFullYears(yy)
    .filter(isInPast)
    .map((year) => toChecksumBasis(year, baseNumber))
}

function getChecksumBasesForStandardDob(baseNumber, toDob) {
  const firstSix = getFirstSix(baseNumber)
  const dob = toDob(firstSix)
  const validPastDates = getValidPastDates(dob)
  const extractYearFromDate = (date) => parseInt(date.split('-')[0], 10)
  const validPastYears = validPastDates.map(extractYearFromDate)
  return validPastYears.map((year) => toChecksumBasis(year, baseNumber))
}

function getChecksumBases(number, toDob) {
  const firstSix = getFirstSix(number)
  const dob = toDob(firstSix)
  const baseNumber = getBaseNumber(number)

  if (isUnknownDob(dob)) return getChecksumBasesUnknownDob(baseNumber)

  return getChecksumBasesForStandardDob(baseNumber, toDob)
}

function isValidChecksumPair(checksumBasis, checksum) {
  return !((checksumBasis + checksum) % 97)
}

export function validChecksum(number, toDob = defaultToDob) {
  const checksumBases = getChecksumBases(number, toDob)
  const checksum = getChecksum(number)
  return checksumBases.some((csb) => isValidChecksumPair(csb, checksum))
}
