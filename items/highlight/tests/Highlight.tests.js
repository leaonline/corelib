/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Highlight } from '../Highlight'
import '../score'
import { createSchema, unsafeInt } from '../../../test-helpers.tests'
import { UndefinedScore } from '../../../scoring/UndefinedScore'
import { ScoringTypes } from '../../../scoring/ScoringTypes'

describe(Highlight.name, () => {
  it('ensures the integrity of the basic structure', () => {
    expect(Highlight.name).to.equal('highlight')
    expect(Highlight.label).to.be.a('string')
    expect(Highlight.icon).to.be.a('string')
    expect(Highlight.isItem).to.equal(true)
  })

  it('has a valid schema', () => {
    createSchema(Highlight.schema)
  })

  describe('scoring', () => {
    let itemId
    beforeEach(() => {
      itemId = Random.id()
    })

    const createItemDoc = ({ competency = Random.id(), correctResponse = 0, requires = 1, explanation } = {}) => ({
      scoring: [{
        competency,
        correctResponse: Array.isArray(correctResponse)
          ? correctResponse
          : [correctResponse],
        requires,
        explanation
      }]
    })

    describe('validation', () => {
      it('throws on unexpected scoring def', () => {
        const input = [
          [() => Highlight.score(), 'Expected item doc scoring array'],
          [() => Highlight.score(createItemDoc({ correctResponse: null })), 'Match error: Expected number, got null in field [0].correctResponse[0]'],
          [() => Highlight.score(createItemDoc({
            competency: null
          })), 'Match error: Expected string, got null in field [0].competency'],
          [() => Highlight.score(createItemDoc({
            requires: null
          })), 'Match error: Expected number, got null in field [0].requires']
        ]

        for (const [fn, message] of input) {
          expect(fn).to.throw(message)
        }
      })

      it('throws on invalid response inputs', () => {
        const itemDoc = createItemDoc()
        const invalidInputs = [
          [1.1], [true],
          [new Date()], [/1/],
          [{}], [() => {}],
          [unsafeInt()], [unsafeInt(true)],
          [unsafeInt().toExponential()], [unsafeInt(true).toExponential()],
          [String(unsafeInt())], [String(unsafeInt(true))],
          [String(unsafeInt().toExponential())], [String(unsafeInt(true).toExponential())],
          [Infinity], [-Infinity]
        ]

        invalidInputs.forEach(responses => {
          const responseDoc = { itemId, responses }
          expect(() => Highlight.score(itemDoc, responseDoc))
            .to.throw(`Expected ${responses[0]} to be safe integer in ${itemId}`)
        })
      })
    })

    describe('undefined values', () => {
      it('correctly scores an undefined result', () => {
        const itemDoc = createItemDoc()
        const cyclicArray = []
        const cyclicSub = []
        cyclicSub.push(cyclicArray)
        cyclicArray.push(cyclicSub)

        ;[
          [],
          [[]],
          [''],
          [null],
          [undefined],
          [UndefinedScore],
          cyclicArray
        ].forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: responses,
            score: false,
            isUndefined: true,
            itemId,
            explanation: itemDoc.scoring[0].explanation
          }, responses)
        })
      })
    })

    describe(ScoringTypes.all.name, () => {
      it('correctly scores a false result', () => {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.all.value
        })

        const falseResponses = [
          [1], [6], [0, 1, 6], [1, 3, 6], [1, 6, 8],
          ['1'], ['6'], ['0', '1', '6'], ['1', '3', '6'], ['1', '6', '8']
        ]

        falseResponses.forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: false,
            itemId,
            explanation: itemDoc.scoring[0].explanation
          })
        })
      })
      it('correctly scores a true result', () => {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.all.value
        })

        const trueResponse = [
          [1, 6], [6, 1],
          ['1', '6'], ['6', '1']
        ]

        trueResponse.forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          const expectedValue = responses.map(val => parseInt(val, 10)).sort()
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: true,
            isUndefined: false,
            itemId,
            explanation: itemDoc.scoring[0].explanation
          })
        })
      })
    })

    describe(ScoringTypes.any.name, () => {
      it('correctly scores a false result', () => {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.any.value
        })

        const falseResponses = [
          [10], [0], [2, 3, 4],
          ['10'], ['0'], ['2', '3', '4']
        ]

        falseResponses.forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: false,
            itemId,
            explanation: itemDoc.scoring[0].explanation
          })
        })
      })
      it('correctly scores a true result', () => {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.any.value
        })

        const trueResponse = [
          [1, 6], [6, 1], [1], [6], [1, 3], [6, 3],
          ['1', '6'], ['6', '1'], ['1'], ['6'], ['1', '3'], ['6', '3']
        ]

        trueResponse.forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: true,
            isUndefined: false,
            itemId,
            explanation: itemDoc.scoring[0].explanation
          })
        })
      })
    })

    describe(ScoringTypes.allInclusive.name, () => {
      it('correctly scores a false result', () => {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.allInclusive.value,
          explanation: 'moo'
        })

        const falseResponses = [
          [10], [0], [2, 3, 4], [1, 3], [6, 3],
          ['10'], ['0'], ['2', '3', '4'], ['1', '3'], ['6', '3']
        ]

        falseResponses.forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: false,
            itemId,
            explanation: itemDoc.scoring[0].explanation
          })
        })
      })
      it('correctly scores a true result', () => {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.allInclusive.value
        })

        const trueResponse = [
          [1, 6], [6, 1], [6, 3, 1], [1, 3, 6],
          ['1', '6'], ['6', '1'], ['1', '3', '6'], ['6', '3', '1']
        ]

        trueResponse.forEach(responses => {
          const responseDoc = { itemId, responses }
          const score = Highlight.score(itemDoc, responseDoc)
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: true,
            itemId,
            explanation: itemDoc.scoring[0].explanation,
            isUndefined: false
          })
        })
      })
    })
  })
})
