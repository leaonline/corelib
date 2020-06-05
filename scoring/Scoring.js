const scoreFunctions = new Map()

let _initialized = false

export const Scoring = {
  name: 'scoring',
  types: {
    all: {
      name: 'all',
      value: 1,
      label: 'scoring.requires.all'
    },
    any: {
      name: 'any',
      value: 2,
      label: 'scoring.requires.any'
    }
  },
  UNDEFINED: '__undefined__',
  isUndefined: value => typeof value === 'undefined' || value === null || value === Scoring.UNDEFINED,
  register: (key, fn) => scoreFunctions.set(key, fn),
  run: function (key, itemDoc, responseDoc) {
    const scoreFn = scoreFunctions.get(key)
    if (!scoreFn) throw new Error(`Expected scorer by key <${key}>`)
    return scoreFn(itemDoc, responseDoc)
  },
  async init () {
    if (_initialized) return true
    const { Choice } = await import('../items/choice/score')
    const { Cloze } = await import('../items/text/score')
    Scoring.register(Choice.name, Choice.score)
    Scoring.register(Cloze.name, Cloze.score)
    _initialized = true
    return true
  }
}
