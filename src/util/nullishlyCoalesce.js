const nullishlyCoalesce = (a, b) => {
  if (a === undefined || a === null) {
    return b
  }
  return a
}

export default nullishlyCoalesce
