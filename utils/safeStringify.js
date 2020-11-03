/**
 * Stringifies a JSON-able Object by preventing type errors due to
 * circular logic.
 * @param any
 * @return {string}
 */
export const safeStringify = function safeStringify (any) {
  const cyclic = new Set()
  return JSON.stringify(any, function (key, val) {
    if (val != null && typeof val === 'object') {
      if (cyclic.has(val)) {
        return 'cyclic'
      }
      cyclic.add(val)
    }
    return val
  }, 0)
}
