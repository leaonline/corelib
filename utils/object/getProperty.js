export const getProperty = (obj, prop) => {
  if (!obj || !Object.hasOwnProperty.call(obj, prop)) {
    return
  }

  return obj[prop]
}
