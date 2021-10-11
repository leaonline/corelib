import { check, Match } from 'meteor/check'
import { Connect } from './Connect'
import { Scoring } from '../../scoring/Scoring'
import { isUndefinedResponse } from '../../utils/response/isUndefinedResponse'
import { isSafeInteger } from '../../utils/numbers/isSafeInteger'
import { toInteger } from '../../utils/numbers/toInteger'

Connect.score = function (itemDoc = {}, responseDoc = {}) {
  // check(itemDoc.scoring, [{
  //   competency: String,
  //   correctResponse: Match.ObjectIncluding({
  //     left: Number,
  //     right: Number
  //   }),
  //   requires: Number
  // }])

  const { scoring } = itemDoc
  const isUndefined = isUndefinedResponse(responseDoc.responses)

  // of not undefined we check and map all responses to valid integers
  const mappedResponses = !isUndefined && {
    responses: responseDoc.responses.map(value => {
      // we need to check for value integrity, allowed are strings of integers
      // or integers (which could also .0 floats, they are basically ints in JS)
      check(value, Match.Where(isSafeInteger))
      return toInteger(value)
    })
  }

  return scoring.map(entry => {
    if (isUndefined) {
      return fail(entry, responseDoc, isUndefined)
    }

    switch (entry.requires) {
      case Scoring.types.all.value:
        return fail(entry, mappedResponses, isUndefined)
      case Scoring.types.allInclusive.value:
        return fail(entry, mappedResponses, isUndefined)
      case Scoring.types.any.value:
        return fail(entry, mappedResponses, isUndefined)
      default:
        throw new Error(`Unexpected scoring type ${entry.requires}`)
    }
  })
}

function fail ({ competency, correctResponse }, { responses }, isUndefined) {
  return {
    competency,
    correctResponse,
    value: responses,
    score: false,
    isUndefined
  }
}

export { Connect }
