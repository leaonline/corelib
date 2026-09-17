import { check } from 'meteor/check'

export const createScoringInputValidator = ({ scoringMatcher, itemDocMatcher }) => {
  return ({ itemDoc, responseDoc }) => {
    // 1. validate item doc
    if (!itemDoc) throw new Error('Expected item doc object')
    if (!Array.isArray(itemDoc.scoring)) throw new Error('Expected item doc scoring array')
    if (itemDocMatcher) {
      check(itemDoc, itemDocMatcher)
    }
    if (scoringMatcher) {
      check(itemDoc.scoring, [scoringMatcher])
    }

    // 2. validate response doc
    if (!responseDoc) throw new Error('Expected response doc object')
    if (!Array.isArray(responseDoc.responses)) throw new Error('Expected response doc responses array')
    if (!responseDoc.itemId) throw new Error('Expected response doc itemId string')

    // silent pass
  }
}
