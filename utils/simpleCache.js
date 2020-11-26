export const createSimpleCache = () => {
  const cache = new Map()

  return function (key, valueSetterFct) {
    if (!cache.has(key)) {
      cache.set(key, valueSetterFct())
    }
    return cache.get(key)
  }
}
