import { ScoringTypes } from './ScoringTypes'
import { UndefinedScore } from './UndefinedScore'

const scoreFunctions = new Map()

let _initialized = false

export const Scoring = {
  name: 'scoring',
  label: 'scoring.title',
  types: ScoringTypes,
  UNDEFINED: UndefinedScore,
  register: (key, fn) => scoreFunctions.set(key, fn),
  run: function (key, itemDoc, responseDoc) {
    const scoreFn = scoreFunctions.get(key)
    if (!scoreFn) {
      throw new Error(`Expected score function by key <${key}>`)
    }

    return scoreFn(itemDoc, responseDoc)
  },
  has: key => scoreFunctions.has(key),
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
