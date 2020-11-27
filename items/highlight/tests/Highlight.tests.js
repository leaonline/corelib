/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Highlight } from '../Highlight'
import '../score'
import { createSchema, unsafeInt } from '../../../test-helpers.tests'
import { UndefinedScore } from '../../../scoring/UndefinedScore'
import { ScoringTypes } from '../../../scoring/ScoringTypes'

describe(Highlight.name, function () {
  it('ensures the integrity of the basic structure', function () {
    expect(Highlight.name).to.equal('highlight')
    expect(Highlight.label).to.be.a('string')
    expect(Highlight.icon).to.be.a('string')
    expect(Highlight.isItem).to.equal(true)
  })

  it('has a valid schema', function () {
    createSchema(Highlight.schema)
  })

  describe('scoring', function () {

    const createItemDoc = ({ competency = Random.id(), correctResponse = 0, requires = 1 } = {}) => ({
      scoring: [{
        competency: competency,
        correctResponse: Array.isArray(correctResponse)
          ? correctResponse
          : [correctResponse],
        requires: requires
      }]
    })

    describe('validation', function () {
      it('throws on unexpected scoring def', function () {
        expect(() => Highlight.score()).to.throw('Expected array, got undefined')

        expect(() => Highlight.score(createItemDoc({
          correctResponse: null
        }))).to.throw(`Match error: Expected number, got null in field [0].correctResponse[0]`)

        expect(() => Highlight.score(createItemDoc({
          competency: null
        }))).to.throw('Match error: Expected string, got null in field [0].competency')

        expect(() => Highlight.score(createItemDoc({
          requires: null
        }))).to.throw('Match error: Expected number, got null in field [0].requires')
      })

      it('throws on invalid reponse inputs', function () {
        const itemDoc = createItemDoc()
        const invalidInputs = [
          [1.1], [true],
          [new Date()], [new RegExp('1')],
          [{}], [() => {}],
          [unsafeInt()], [unsafeInt(true)],
          [unsafeInt().toExponential()], [unsafeInt(true).toExponential()],
          [String(unsafeInt())], [String(unsafeInt(true))],
          [String(unsafeInt().toExponential())], [String(unsafeInt(true).toExponential())],
          [Infinity], [-Infinity]
        ]

        invalidInputs.forEach(responses => {
          expect(() => Highlight.score(itemDoc, { responses }))
            .to.throw('Match error: Failed Match.Where validation')
        })
      })
    })

    describe('undefined values', function () {
      it('correctly scores an undefined result', function () {
        const itemDoc = createItemDoc()
        const cyclicArray = []
        const cyclicSub = []
        cyclicSub.push(cyclicArray)
        cyclicArray.push(cyclicSub)

        ;[
          undefined,
          [],
          [[]],
          [''],
          [null],
          [undefined],
          [UndefinedScore],
          cyclicArray
        ].forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: responses,
            score: false,
            isUndefined: true
          }, responses)
        })
      })
    })

    describe(ScoringTypes.all.name, function () {
      it('correctly scores a false result', function () {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.all.value
        })

        const falseResponses = [
          [1], [6], [0, 1, 6], [1, 3, 6], [1, 6, 8],
          ['1'], ['6'], ['0', '1', '6'], ['1', '3', '6'], ['1', '6', '8'],
        ]

        falseResponses.forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: false
          })
        })
      })
      it('correctly scores a true result', function () {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.all.value
        })

        const trueResponse = [
          [1, 6], [6, 1],
          ['1', '6'], ['6', '1'],
        ]

        trueResponse.forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          const expectedValue = responses.map(val => parseInt(val, 10)).sort()
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: true,
            isUndefined: false
          })
        })
      })
    })

    describe(ScoringTypes.any.name, function () {
      it('correctly scores a false result', function () {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.any.value
        })

        const falseResponses = [
          [10], [0], [2, 3, 4],
          ['10'], ['0'], ['2', '3', '4']
        ]

        falseResponses.forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: false
          })
        })
      })
      it('correctly scores a true result', function () {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.any.value
        })

        const trueResponse = [
          [1, 6], [6, 1], [1], [6], [1, 3], [6, 3],
          ['1', '6'], ['6', '1'], ['1'], ['6'], ['1', '3'], ['6', '3']
        ]

        trueResponse.forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: true,
            isUndefined: false
          })
        })
      })
    })

    describe(ScoringTypes.allInclusive.name, function () {
      it('correctly scores a false result', function () {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.allInclusive.value
        })

        const falseResponses = [
          [10], [0], [2, 3, 4], [1, 3], [6, 3],
          ['10'], ['0'], ['2', '3', '4'], ['1', '3'], ['6', '3']
        ]

        falseResponses.forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: false
          })
        })
      })
      it('correctly scores a true result', function () {
        const itemDoc = createItemDoc({
          correctResponse: [1, 6],
          requires: ScoringTypes.allInclusive.value
        })

        const trueResponse = [
          [1, 6], [6, 1], [6, 3, 1], [1, 3, 6],
          ['1', '6'], ['6', '1'], ['1', '3', '6'], ['6', '3', '1'],
        ]

        trueResponse.forEach(responses => {
          const score = Highlight.score(itemDoc, { responses })
          const expectedValue = responses.map(val => parseInt(val, 10))
          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: true,
            isUndefined: false
          })
        })
      })
    })
  })
})