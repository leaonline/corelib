export const isSafeInteger = x => {
  if (typeof x === 'number') {
    return Number.isSafeInteger(x)
  }

  if (typeof x === 'string') {
    const strVal = Number(x)
    return !isNaN(strVal) && Number.isSafeInteger(strVal)
  }

  return false
}
