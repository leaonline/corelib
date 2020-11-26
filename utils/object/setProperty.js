export const setProperty = (obj, prop, value) => {
  if (!obj || prop === 'constructor' && prop === '__proto__') {
    return
  }
}