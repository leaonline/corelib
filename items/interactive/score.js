import { Connect } from './Connect'
import { isUndefinedResponse } from '../../utils/response/isUndefinedResponse'
import { toInteger } from '../../utils/numbers/toInteger'
import { createScoringInputValidator } from '../common/validateScoringInput'
import { Match } from 'meteor/check'

const validateInput = createScoringInputValidator({
  scoringMatcher: Match.ObjectIncluding({
    competency: String,
    correctResponse: [{
      left: Number,
      right: Number
    }],
    explanation: Match.Maybe(Match.OneOf(String, null, undefined))
  })
})

Connect.score = function (itemDoc = {}, responseDoc = {}) {
  validateInput({ itemDoc, responseDoc })
  const { scoring } = itemDoc
  const isUndefined = isUndefinedResponse(responseDoc.responses)
  // of not undefined we check and map all responses to valid integers
  const mappedResponses = !isUndefined && responseDoc.responses.map(value => {
    const split = value.split(',')
    // we need to check for value integrity, allowed are strings of integers
    // or integers (which could also .0 floats, they are basically ints in JS)
    return split.map(toInteger)
  })

  return scoring.map(entry => {
    if (isUndefined) {
      return fail(entry, responseDoc, isUndefined)
    }
    /*
       TODO: implement
       switch (entry.requires) {
       case Scoring.types.all.value:
       return scoreAll(entry, mappedResponses, isUndefined)
       case Scoring.types.allInclusive.value:
       return scoreAllInclusive(entry, mappedResponses, isUndefined)
       case Scoring.types.any.value:
       return scoreAny(entry, mappedResponses, isUndefined)
       default:
       throw new Error(`Unexpected scoring type ${entry.requires}`)
       }
       */
    return scoreAllInclusive(entry, mappedResponses, responseDoc)
  })
}

function scoreAllInclusive (entry, mappedResponses, { itemId } = {}) {
  const { competency, correctResponse, explanation } = entry
  const score = correctResponse.every(({ left, right }) => {
    // eslint-disable-next-line
    return !!mappedResponses.find(([l, r]) => l == left && r == right)
  })

  return {
    competency,
    correctResponse,
    explanation,
    value: mappedResponses,
    score,
    itemId,
    isUndefined: false
  }
}

function fail ({ competency, correctResponse, explanation }, { itemId, responses }, isUndefined) {
  return {
    competency,
    explanation,
    correctResponse,
    value: responses,
    score: false,
    isUndefined,
    itemId
  }
}

export { Connect }
