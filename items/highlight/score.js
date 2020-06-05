import { Highlight } from './Highlight'
import { Scoring } from '../../scoring/Scoring'
import { isUndefinedResponse } from '../../utils/isUndefinedResponse'
import { toInteger } from '../../utils/toInteger'

Highlight.score = function (itemDoc, responseDoc) {
  const { scoring } = itemDoc

  return scoring.map(entry => {
    if (isUndefinedResponse(responseDoc.responses)) {
      return fail(entry, responseDoc, true)
    }
    switch (entry.requires) {
      case Scoring.types.all.value:
        return scoreAll(entry, responseDoc)
      case Scoring.types.allInclusive.value:
        return scoreAllInclusive(entry, responseDoc)
      case Scoring.types.any.value:
        return scoreAny(entry, responseDoc)
      default:
        throw new Error(`Unexpected scoring type ${entry.requires}`)
    }
  })
}

function fail ({ competency, correctResponse }, { responses }, isUndefined) {
  return { competency, correctResponse, value: responses, score: false, isUndefined }
}

function scoreAllInclusive ({ competency, correctResponse }, { responses }) {
  const mappedResponses = responses.map(toInteger)
  return correctResponse.every((value) => mappedResponses.includes(value))
    ? { competency, correctResponse, value: responses, score: true }
    : { competency, correctResponse, value: responses, score: false }
}

function scoreAll ({ competency, correctResponse }, { responses }) {
  if (correctResponse.length !== responses.length) {
    return fail({ competency, correctResponse }, { responses }, false)
  }
  correctResponse.sort()
  responses.sort()
  return correctResponse.every((value, index) => toInteger(responses[index]) === value)
    ? { competency, correctResponse, value: responses, score: true }
    : { competency, correctResponse, value: responses, score: false }
}

function scoreAny ({ competency, correctResponse }, { responses }) {
  const mappedResponses = responses.map(toInteger)
  return correctResponse.some(value => mappedResponses.includes(value))
    ? { competency, correctResponse, value: responses, score: true }
    : { competency, correctResponse, value: responses, score: false }
}

export { Highlight }
