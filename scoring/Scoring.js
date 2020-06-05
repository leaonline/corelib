const scoreFunctions = new Map()

let _initialized = false

export const Scoring = {
  name: 'scoring',
  label: 'scoring.title',
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
    },
    allInclusive: {
      name: 'all',
      value: 3,
      label: 'scoring.requires.allInclusive'
    }
  },
  UNDEFINED: '__undefined__',
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
    const { Highlight } = await import('../items/highlight/score')
    Scoring.register(Choice.name, Choice.score)
    Scoring.register(Cloze.name, Cloze.score)
    Scoring.register(Highlight.name, Highlight.score)
    _initialized = true
    return true
  }
}
