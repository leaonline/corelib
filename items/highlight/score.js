import { Match } from 'meteor/check'
import { Highlight } from './Highlight'
import { Scoring } from '../../scoring/Scoring'
import { isUndefinedResponse } from '../../utils/response/isUndefinedResponse'
import { toInteger } from '../../utils/numbers/toInteger'
import { isSafeInteger } from '../../utils/numbers/isSafeInteger'
import { createScoringInputValidator } from '../common/validateScoringInput'

const validateInputs = createScoringInputValidator({
  scoringMatcher: {
    competency: String,
    correctResponse: [Number],
    requires: Number,
    explanation: Match.OneOf(String, undefined, null)
  }
})

Highlight.score = function (itemDoc = {}, responseDoc = {}) {
  validateInputs({ itemDoc, responseDoc })

  const { scoring } = itemDoc
  const isUndefined = isUndefinedResponse(responseDoc.responses)

  // of not undefined we check and map all responses to valid integers
  const mappedResponses = !isUndefined && {
    responses: responseDoc.responses.map(value => {
      // we need to check for value integrity, allowed are strings of integers
      // or integers (which could also .0 floats, they are basically ints in JS)
      if (!isSafeInteger(value)) {
        throw new TypeError(`Expected ${value} to be safe integer in ${responseDoc.itemId}`)
      }
      return toInteger(value)
    })
  }

  return scoring.map(entry => {
    if (isUndefined) {
      return fail(entry, responseDoc, isUndefined)
    }

    switch (entry.requires) {
      case Scoring.types.all.value:
        return scoreAll(entry, mappedResponses, responseDoc)
      case Scoring.types.allInclusive.value:
        return scoreAllInclusive(entry, mappedResponses, responseDoc)
      case Scoring.types.any.value:
        return scoreAny(entry, mappedResponses, responseDoc)
      default:
        throw new Error(`Unexpected scoring type ${entry.requires}`)
    }
  })
}

function fail ({ competency, correctResponse, explanation }, { itemId, responses }, isUndefined) {
  return {
    competency,
    correctResponse,
    value: responses,
    score: false,
    isUndefined,
    explanation,
    itemId
  }
}

function scoreAll ({ competency, correctResponse, explanation }, { responses }, { itemId }) {
  if (correctResponse.length !== responses.length) {
    return fail({ competency, correctResponse, explanation }, { itemId, responses }, false)
  }

  correctResponse.sort()
  responses.sort()

  const score = correctResponse.every((value, index) => responses[index] === value)
  return { competency, correctResponse, value: responses, score, isUndefined: false, explanation, itemId }
}

function scoreAllInclusive ({ competency, correctResponse, explanation }, { responses }, { itemId }) {
  return correctResponse.every((value) => responses.includes(value))
    ? { competency, correctResponse, value: responses, score: true, isUndefined: false, explanation, itemId }
    : { competency, correctResponse, value: responses, score: false, isUndefined: false, explanation, itemId }
}

function scoreAny ({ competency, correctResponse, explanation }, { responses }, { itemId }) {
  return correctResponse.some(value => responses.includes(value))
    ? { competency, correctResponse, value: responses, score: true, isUndefined: false, explanation, itemId }
    : { competency, correctResponse, value: responses, score: false, isUndefined: false, explanation, itemId }
}

export { Highlight }
