import { check, Match } from 'meteor/check'
import { Choice } from './Choice'
import { Scoring } from '../../scoring/Scoring'
import { toInteger } from '../../utils/numbers/toInteger'
import { isUndefinedResponse } from '../../utils/response/isUndefinedResponse'
import { isSafeInteger } from '../../utils/numbers/isSafeInteger'

Choice.score = function (itemDoc = {}, responseDoc = {}) {
  check(itemDoc.flavor, Number)
  check(itemDoc.scoring, [{
    competency: String,
    correctResponse: [Number],
    requires: Number
  }])
  const { scoring } = itemDoc
  const { flavor } = itemDoc

  return scoring.map(entry => {
    switch (flavor) {
      case Choice.flavors.single.value:
        return scoreSingle(entry, responseDoc)
      case Choice.flavors.multiple.value:
        return scoreMultiple(entry, responseDoc)
      default:
        throw new Error(`Unexpected undefined choice flavor ${flavor}`)
    }
  })
}

function scoreSingle ({ competency, correctResponse, requires }, { responses = [] }) {
  // single choice have only one selected value
  let value = responses[0]
  let score = false
  const isUndefined = isUndefinedResponse(value)

  if (isUndefined) {
    return { competency, correctResponse, value, score, isUndefined }
  }

  // we need to check for value integrity, allowed are strings of integers
  // or integers (which could also .0 floats, they are basically ints in JS)
  check(value, Match.Where(isSafeInteger))

  // values are always sent as string
  // se we need to parse them first
  value = toInteger(value)

  // if all values are required, we only
  // use the first defined expected value
  score = correctResponse.includes(value)

  return { competency, correctResponse, value, score, isUndefined }
}

function scoreMultiple ({ competency, correctResponse, requires }, { responses = [] }) {
  if (isUndefinedResponse(responses)) {
    return {
      competency,
      correctResponse,
      value: responses,
      score: false,
      isUndefined: true
    }
  }

  switch (requires) {
    case Scoring.types.all.value:
      return scoreMultipleAll({
        competency,
        correctResponse,
        requires
      }, { responses })
    case Scoring.types.any.value:
      return scoreMultipleAny({
        competency,
        correctResponse,
        requires
      }, { responses })
    default:
      throw new Error(`Unexpected scoring type ${requires}`)
  }
}

function scoreMultipleAll ({ competency, correctResponse, requires }, { responses }) {
  const mappedResponses = responses.map(value => {
    // we need to check for value integrity, allowed are strings of integers
    // or integers (which could also .0 floats, they are basically ints in JS)
    check(value, Match.Where(isSafeInteger))
    return toInteger(value)
  }).sort()
  let score = false

  // if length does not match we can already return false
  // but use the mapped responses in order to not give the impression
  // that there is a false-negative due to missing value parsing
  if (responses.length !== correctResponse.length) {
    return {
      competency,
      correctResponse,
      value: mappedResponses,
      score,
      isUndefined: false
    }
  }

  // otherwise we assume, that multiple-all is true if the indices exactly match
  score = correctResponse.sort().every((responseIndex, positionIndex) => {
    return mappedResponses[positionIndex] === responseIndex
  })
  return {
    competency,
    correctResponse,
    value: responses,
    score,
    isUndefined: false
  }
}

function scoreMultipleAny ({ competency, correctResponse, requires }, { responses }) {
  const score = responses
    .map(value => {
      if (isUndefinedResponse(value)) return
      // we need to check for value integrity, allowed are strings of integers
      // or integers (which could also .0 floats, they are basically ints in JS)
      check(value, Match.Where(isSafeInteger))
      return toInteger(value)
    })
    .some(value => correctResponse.includes(value))

  return {
    competency,
    correctResponse,
    value: responses,
    score,
    isUndefined: false
  }
}

export { Choice }
