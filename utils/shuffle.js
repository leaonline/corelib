let _shuffle = x => {
  console.warn('[shuffle]: no shuffle function defined, fallback to non-transform mdoe')
  return x
}

export const setShuffle = function (fn) {
  _shuffle = fn
}

export const shuffle = (...args) => _shuffle.apply(_shuffle, args)
