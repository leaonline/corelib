/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Connect } from '../Connect'
import '../score'
import { createSchema } from '../../../test-helpers.tests'
import { UndefinedScore } from '../../../scoring/UndefinedScore'

describe(Connect.name, () => {
  it('ensures the integrity of the basic structure', () => {
    expect(Connect.name).to.equal('connect')
    expect(Connect.label).to.be.a('string')
    expect(Connect.icon).to.be.a('string')
    expect(Connect.isItem).to.equal(true)
  })

  it('has a valid schema', () => {
    createSchema(Connect.schema)
  })

  describe('scoring', () => {
    let itemId
    beforeEach(() => {
      itemId = Random.id()
    })

    const createItemDoc = ({ competency = Random.id(), correctResponse = [{ left: 0, right: 1 }], requires = 1, explanation } = {}) => ({
      scoring: [{
        competency,
        correctResponse,
        requires,
        explanation
      }]
    })

    describe('validation', () => {
      it('throws on unexpected scoring def', () => {
        expect(() => Connect.score()).to.throw()

        const itemDoc = createItemDoc({ correctResponse: null })
        const responseDoc = { itemId, responses: ['0,1'] }
        expect(() => Connect.score(itemDoc, responseDoc)).to.throw()
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
          expect(() => Connect.score(itemDoc, responseDoc)).to.throw()
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
        const score = Connect.score(itemDoc, responseDoc)
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
        correctResponse: [{ left: 0, right: 1 }, { left: 1, right: 2 }]
      })

      ;[
        ['0,1', '2,1'],
        ['0,2', '1,2'],
        ['3,4']
      ].forEach(responses => {
        const responseDoc = { itemId, responses }
        const score = Connect.score(itemDoc, responseDoc)
        const expectedValue = responses.map(value => value.split(',').map(v => parseInt(v, 10)))
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
        correctResponse: [{ left: 0, right: 1 }, { left: 1, right: 2 }]
      })

      ;[
        ['0,1', '1,2'],
        ['1,2', '0,1'],
        ['0,1', '1,2', '4,5']
      ].forEach(responses => {
        const responseDoc = { itemId, responses }
        const score = Connect.score(itemDoc, responseDoc)
        const expectedValue = responses.map(value => value.split(',').map(v => parseInt(v, 10)))
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
