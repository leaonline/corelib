export const setProperty = (obj, prop, value, { enumerable, writable, configurable } = {}) => {
  if (Object.prototype.hasOwnProperty.call(obj, prop)) {
    throw new Error(`Attempted to define already defined property [${prop}].`)
  }

  const options = { enumerable, configurable, writable, value }
  Object.defineProperty(obj, prop, options)

  return obj
}
