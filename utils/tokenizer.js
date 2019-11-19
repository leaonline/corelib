/**
 * Creates a simple tokenizer to split strings by a given pattern, defined by a
 * open-pattern and close-pattern. No AST scanning etc. required.
 * @param openPattern A unique pattern indicate the following content is part if our token
 * @param closePattern A unique pattern indicate the previous content was part of our token
 * @returns {Array<Object>>} An array of token-objects.
 */
export const createSimpleTokenizer = (openPattern, closePattern) => (value) => {
  if ('string' !== typeof value || value.length === 0) {
    return []
  }

  let startIndex = 0, endIndex = 0
  const tokens = []

  while (startIndex < value.length && startIndex > -1) {
    startIndex = value.indexOf(openPattern, endIndex)

    if (startIndex === -1 || startIndex >= value.length) {
      // no open bracket is found, we still try to add the rest of the words
      // that may remain in the value string until the end
      tokens.push({ value: value.substring(endIndex, value.length) })
      break
    }

    // add previous words
    tokens.push({ value: value.substring(endIndex, startIndex) })

    // add input related words
    endIndex = value.indexOf(closePattern, startIndex)
    tokens.push({ isToken: true, value: value.substring(startIndex + openPattern.length, endIndex) })
    endIndex += closePattern.length
  }

  return tokens
}