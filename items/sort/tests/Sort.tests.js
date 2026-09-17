/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Sort } from '../Sort'
import '../score'
import { createSchema } from '../../../test-helpers.tests'
import { UndefinedScore } from '../../../scoring/UndefinedScore'

describe(Sort.name, () => {
  it('ensures the integrity of the basic structure', () => {
    expect(Sort.name).to.equal('sort')
    expect(Sort.label).to.be.a('string')
    expect(Sort.icon).to.be.a('string')
    expect(Sort.isItem).to.equal(true)
  })

  it('has a valid schema', () => {
    createSchema(Sort.schema)
  })

  describe('scoring', () => {
    let itemId
    beforeEach(() => {
      itemId = Random.id()
    })

    const createItemDoc = ({ competency = Random.id(), correctResponse = [0, 1, 2], requires = 1, explanation } = {}) => ({
      scoring: [{
        competency,
        correctResponse,
        requires,
        explanation
      }]
    })

    describe('validation', () => {
      it('throws on unexpected scoring def', () => {
        expect(() => Sort.score()).to.throw()

        const itemDoc = createItemDoc({ correctResponse: null })
        const responseDoc = { itemId, responses: ['0,1,2'] }
        expect(() => Sort.score(itemDoc, responseDoc)).to.throw()
      })

      it('throws on invalid response inputs', () => {
        const itemDoc = createItemDoc()
        const invalidInputs = [
          [1.1], [true],
          [new Date()], [/1/],
          [{}], [() => {}],
          [Infinity], [-Infinity]
        ]

        invalidInputs.forEach(responses => {
          const responseDoc = { itemId, responses }
          expect(() => Sort.score(itemDoc, responseDoc)).to.throw()
        })
      })
    })

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
        const score = Sort.score(itemDoc, responseDoc)
        expect(score[0]).to.deep.equal({
          competency: itemDoc.scoring[0].competency,
          correctResponse: itemDoc.scoring[0].correctResponse,
          explanation: itemDoc.scoring[0].explanation,
          value: responses,
          score: false,
          isUndefined: true,
          itemId
        })
      })
    })

    it('correctly scores a false result', () => {
      const itemDoc = createItemDoc({
        correctResponse: [0, 1, 2]
      })

      ;[
        ['2,1,0'],
        ['2,0,1'],
        ['1,0,2'],
        ['0,2,1']
      ].forEach(responses => {
        const responseDoc = { itemId, responses }
        const score = Sort.score(itemDoc, responseDoc)
        const expectedValue = responses.map(value => value.split(',').map(v => parseInt(v, 10)))[0]
        expect(score[0]).to.deep.equal({
          competency: itemDoc.scoring[0].competency,
          correctResponse: itemDoc.scoring[0].correctResponse,
          explanation: itemDoc.scoring[0].explanation,
          value: expectedValue,
          score: false,
          isUndefined: false,
          itemId
        })
      })
    })

    it('correctly scores a true result', () => {
      const itemDoc = createItemDoc({
        correctResponse: [0, 1, 2]
      })

      ;[
        ['0,1,2']
      ].forEach(responses => {
        const responseDoc = { itemId, responses }
        const score = Sort.score(itemDoc, responseDoc)
        const expectedValue = responses.map(value => value.split(',').map(v => parseInt(v, 10)))[0]
        expect(score[0]).to.deep.equal({
          competency: itemDoc.scoring[0].competency,
          correctResponse: itemDoc.scoring[0].correctResponse,
          explanation: itemDoc.scoring[0].explanation,
          value: expectedValue,
          score: true,
          isUndefined: false,
          itemId
        })
      })
    })
  })
})
