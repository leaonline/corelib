/**
 * Wrap imports with potential to cause circular referencing issues in
 * a function that return sthe desired result and pass thi function to this one.
 *
 * The function will only run when the internal proxy trap is accessed.
 * @param fct
 * @return {{}}
 */
export const trapCircular = function trapCircular (fct) {
  return new Proxy({}, {
    get: function (target, name, o) {
      const data = fct()

      if (name === 'toJSON') {
        return () => data
      }

      if (Object.prototype.hasOwnProperty.call(data, name)) {
        return data[name]
      }
    }
  })
}
