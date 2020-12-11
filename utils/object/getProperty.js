export const getProperty = (obj, prop) => {
  if (obj === null || obj === undefined || !Object.hasOwnProperty.call(obj, prop)) {
    return
  }

  return obj[prop]
}
