export const setProperty = (obj, prop, value, { enumerable, writable, configurable } = {}) => {
  if (prop in Object) {
    throw new Error(`Attempted to set forbidden property [${prop}].`)
  }

  const options = { enumerable, configurable, writable, value }
  Object.defineProperty(obj, prop, options)

  return obj
}
