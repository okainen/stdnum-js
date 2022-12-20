import getValidationResult from './getValidationResult'

const buildValidate = (validators) => (string) => {
  const result = validators.reduce((result, curr) => {
    if (result) {
      return result
    }

    const rawResult = curr.validate(string)
    if (rawResult.isValid) {
      return getValidationResult({ ...curr, data: rawResult })
    }
    return result
  }, undefined)

  if (result) {
    return result
  }
  return { isValid: false }
}

export default buildValidate
