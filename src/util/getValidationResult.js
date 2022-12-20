const getMeaning = ({ localName, name }) => `${name}${localName ? ` (${localName})` : ''}`

const getValidationResult = ({
  abbreviation, data, localName, name,
}) => ({
  ...data,
  abbreviation,
  localName,
  meaning: getMeaning({ localName, name }),
  name,
})

export default getValidationResult
