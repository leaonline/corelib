import { Match } from 'meteor/check'
import { Sort } from './Sort'
import { isUndefinedResponse } from '../../utils/response/isUndefinedResponse'
import { createScoringInputValidator } from '../common/validateScoringInput'
import { toInteger } from '../../utils/numbers/toInteger'

const validateInput = createScoringInputValidator({
  scoringMatcher: Match.ObjectIncluding({
    competency: String,
    correctResponse: [Number],
    explanation: Match.Maybe(Match.OneOf(String, null, undefined))
  })
})

Sort.score = (itemDoc = {}, responseDoc = {}) => {
  validateInput({ itemDoc, responseDoc })
  const { scoring } = itemDoc
  const isUndefined = isUndefinedResponse(responseDoc.responses)
  const mappedResponses = !isUndefined && responseDoc.responses.map(value => {
    const split = value.split(',')
    // we need to check for value integrity, allowed are strings of integers
    // or integers (which could also .0 floats, they are basically ints in JS)
    return split.map(toInteger)
  }).flat()

  return scoring.map(entry => {
    if (isUndefined) {
      return fail(entry, responseDoc, isUndefined)
    }
    return scoreAllInclusive(entry, mappedResponses, responseDoc)
  })
}

function scoreAllInclusive (entry, mappedResponses, responseDoc) {
  const { competency, correctResponse, explanation } = entry
  const { itemId } = responseDoc

  // [0,1,2,3] == [0,1,2,3] -> true
  // [0,1,2,3] == [3,2,1,0] -> false
  const score = JSON.stringify(mappedResponses, null, 0) === JSON.stringify(correctResponse, null, 0)

  return {
    competency,
    correctResponse,
    value: mappedResponses,
    score,
    isUndefined: false,
    explanation,
    itemId
  }
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

export { Sort }
