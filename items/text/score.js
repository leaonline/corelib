import { Cloze } from './Cloze'
import { isUndefinedResponse } from '../../utils/isUndefinedResponse'

Cloze.score = function (itemDoc, responseDoc) {
  const { scoring } = itemDoc
  const { flavor } = itemDoc

  return scoring.map(entry => {
    switch (flavor) {
      case Cloze.flavor.blanks.value:
        return scoreBlanks(entry, responseDoc)
      case Cloze.flavor.select.value:
        return scoreSelect(entry, responseDoc)
      default:
        throw new Error(`Unexpected undefined choice flavor ${flavor}`)
    }
  })
}

function scoreBlanks (entry, responseDoc) {
  let score = false
  const { correctResponse, competency } = entry
  const { responses = [] } = responseDoc
  const value = responses[0]
  const isUndefined = isUndefinedResponse(value)

  if (isUndefined) {
    return { competency, correctResponse, value, score, isUndefined }
  }

  // texts are scored against a RegExp pattern
  score = correctResponse.test(value)

  return { competency, correctResponse, value, score, isUndefined }
}

function scoreSelect (entry, responseDoc) {
  throw new Error('not implemented')
}

export { Cloze }
