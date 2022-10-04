const alphanumericRE = /^[A-Za-z0-9]+$/
const digitRE = /^[0-9]+$/
const alphaRE = /^[A-Za-z]+$/

/**
 * Alpha numeric check A-Za-z0-9
 */
export function isalphanumeric(value) {
  return alphanumericRE.test(value)
}

export function isdigits(value) {
  return digitRE.test(value)
}

export function isalpha(value) {
  return alphaRE.test(value)
}
