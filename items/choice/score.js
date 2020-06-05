import { Choice } from './Choice'
import { Scoring } from '../../scoring/Scoring'
import { toInteger } from '../../utils/toInteger'

Choice.score = function (itemDoc, responseDoc) {
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
  let isUndefined = Scoring.isUndefined(value)

  if (isUndefined) {
    return { competency, correctResponse, value, score, isUndefined }
  }

  // values are always sent as string
  // se we need to parse them first
  value = toInteger(value)

  // if all values are required, we only
  // use the first defined expected value
  score = correctResponse.includes(value)

  return { competency, correctResponse, value, score, isUndefined }
}

function scoreMultiple ({ competency, correctResponse, requires }, { responses = [] }) {
  if (Scoring.isUndefined(responses) || Scoring.isUndefined(responses[0])) {
    return { competency, correctResponse, value: responses, score: false, isUndefined: true }
  }

  switch (requires) {
    case Scoring.types.all.value:
      return scoreMultipleAll({ competency, correctResponse, requires }, { responses })
    case Scoring.types.any.value:
      return scoreMultipleAny({ competency, correctResponse, requires }, { responses })
    default:
      throw new Error(`Unexpected scoring type ${requires}`)
  }
}

function scoreMultipleAll ({ competency, correctResponse, requires }, { responses }) {
  const mappedResponses = responses.map(toInteger).sort()
  let score = false

  // if length does not match we can already return false
  // but use the mapped responses in order to not give the impression
  // that there is a false-negative due to missing value parsing
  if (responses.length !== correctResponse.length) {
    return { competency, correctResponse, value: mappedResponses, score }
  }

  // otherwise we assume, that multiple-all is true if the indices exactly match
  score = correctResponse.sort().every((responseIndex, positionIndex) => {
    return mappedResponses[positionIndex] === responseIndex
  })
  return { competency, correctResponse, value: responses, score }
}

function scoreMultipleAny ({ competency, correctResponse, requires }, { responses }) {
  const score = correctResponse.some(responseIndex => {
    const value = responses[responseIndex]
    return !Scoring.isUndefined(value) && Number.parseInt(value, 10) === responseIndex
  })
  return { competency, correctResponse, value: responses, score }
}

export { Choice }