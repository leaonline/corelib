import { Cloze } from './Cloze'
import { isUndefinedResponse } from '../../utils/response/isUndefinedResponse'
import { check, Match } from 'meteor/check'

const critical = /eval\s*\(|__proto__|require\s*\(|import\s*'|new function|\.prototype|function\s*\(/i
const isSafeTextString = s => {
  if (typeof s !== 'string') {
    return false
  }

  if (s.length > Cloze.MAX_LENGTH) {
    return false
  }

  return !critical.test(s)
}

Cloze.score = function (itemDoc = {}, responseDoc = {}) {
  check(itemDoc.scoring, [{
    competency: [String],
    correctResponse: RegExp,
    target: Number,
    explanation: Match.Maybe(String)
  }])

  const { scoring } = itemDoc

  // checks all entries for undefined so we skip further
  // expensive computations and set all to false + undefined flag
  const allUndefined = isUndefinedResponse(responseDoc.responses)

  return scoring.map(entry => {
    if (allUndefined) {
      return {
        competency: entry.competency,
        correctResponse: entry.correctResponse,
        value: responseDoc.responses,
        score: false,
        explanation: entry.explanation,
        target: entry.target,
        isUndefined: true
      }
    }

    return scoreBlanks(entry, responseDoc)
  })
}

function scoreBlanks (entry, { responses = [] }) {
  if (!Array.isArray(responses)) {
    throw new Error('Match error: Failed Match.Where validation')
  }

  let score = false
  const { correctResponse, competency, target, explanation } = entry
  const value = responses[target]

  // we still may have individual undefined cases, and we need to cover that
  // there may be text inputs, that explicitly ask for an undefined response
  const isUndefined = !correctResponse.source.includes('__undefined__') && isUndefinedResponse(value)

  if (isUndefined) {
    return { competency, correctResponse, target, value, score, isUndefined, explanation }
  }

  check(value, Match.Where(isSafeTextString))

  // texts are scored against a RegExp pattern
  score = correctResponse.test(value)

  return { competency, correctResponse, target, value, score, explanation, isUndefined: false }
}

export { Cloze }
