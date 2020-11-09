import { Cloze } from './Cloze'
import { isUndefinedResponse } from '../../utils/isUndefinedResponse'

Cloze.score = function (itemDoc, responseDoc) {
  const { scoring } = itemDoc
  return scoring.map(entry => scoreBlanks(entry, responseDoc))
}

function scoreBlanks (entry, responseDoc) {
  let score = false
  const { correctResponse, competency, target } = entry
  const { responses = [] } = responseDoc
  const value = responses[target]
  const isUndefined = isUndefinedResponse(value)

  if (isUndefined) {
    return { competency, correctResponse, value, score, isUndefined }
  }

  // texts are scored against a RegExp pattern
  score = correctResponse.test(value)

  return { competency, correctResponse, value, score, isUndefined }
}

export { Cloze }
