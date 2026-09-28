/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import '../score'
import { Cloze } from '../Cloze'
import { createSchema, unsafeInt } from '../../../test-helpers.tests'
import { UndefinedScore } from '../../../scoring/UndefinedScore'

describe(Cloze.name, function () {
  it('ensures the integrity of the basic structure', function () {
    expect(Cloze.name).to.equal('cloze')
    expect(Cloze.label).to.be.a('string')
    expect(Cloze.icon).to.be.a('string')
    expect(Cloze.isItem).to.equal(true)
  })

  it('has a valid schema', function () {
    createSchema(Cloze.schema)
  })

  it('has certain flavours defined', function () {
    expect(Cloze.flavor.select).to.deep.equal({
      name: 'select',
      value: 1
    })
    expect(Cloze.flavor.blanks).to.deep.equal({
      name: 'blanks',
      value: 2
    })
    expect(Cloze.flavor.empty).to.deep.equal({
      name: 'empty',
      value: 3
    })
    expect(Cloze.flavor.text).to.deep.equal({
      name: 'text',
      value: 4
    })
  })

  describe('scoring', function () {
    let itemId
    beforeEach(() => {
      itemId = Random.id(6)
    })
    const createItemDoc = ({ competency = Random.id(), correctResponse = /foo/, target = 0, explanation } = {}) => ({
      scoring: [{
        competency: [competency],
        correctResponse,
        target,
        explanation
      }]
    })

    it('throws on unexpected scoring def', function () {
      expect(() => Cloze.score()).to.throw('Expected item doc scoring array')

      expect(() => Cloze.score(createItemDoc({
        correctResponse: null
      }))).to.throw('Match error: Expected RegExp in field [0].correctResponse')

      expect(() => Cloze.score(createItemDoc({
        competency: null
      }))).to.throw('Match error: Expected string, got null in field [0].competency')

      expect(() => Cloze.score(createItemDoc({
        target: null
      }))).to.throw('Match error: Expected number, got null in field [0].target')
    })
    it('correctly scores undefined result', function () {
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
        const score = Cloze.score(itemDoc, responseDoc)
        expect(score[0]).to.deep.equal({
          competency: itemDoc.scoring[0].competency,
          correctResponse: itemDoc.scoring[0].correctResponse,
          value: responses,
          itemId,
          explanation: itemDoc.explanation,
          target: itemDoc.scoring[0].target,
          score: false,
          isUndefined: true
        })
      })
    })
    it('throws on invalid response inputs', function () {
      const itemDoc = createItemDoc()
      const invalidInputs = [
        [1.1], [true],
        [new Date()], [/1/],
        [{}], [() => {}],
        [unsafeInt()], [unsafeInt(true)],
        [Number(unsafeInt().toExponential())], [Number(unsafeInt(true).toExponential())],
        [Infinity], [-Infinity],
        ['this is some example of eval ("whatever bad")'],
        ['const { exec } = require("child_process")']
      ]

      invalidInputs.forEach(responses => {
        const responseDoc = { itemId, responses }
        expect(() => Cloze.score(itemDoc, responseDoc))
          .to.throw('Match error: Failed Match.Where validation')
      })
    })
    it('correctly scores false results', function () {
      const itemDoc = createItemDoc({
        correctResponse: /^[fobarz]+$/i,
        target: 1
      })

      const invalidInputs = [
        ['', 'woa'],
        ['', 'foo bar'],
        ['foo bar', 'bartz']
      ]

      invalidInputs.forEach((responses) => {
        const responseDoc = { itemId, responses }
        const score = Cloze.score(itemDoc, responseDoc)
        expect(score[0]).to.deep.equal({
          itemId,
          competency: itemDoc.scoring[0].competency,
          correctResponse: itemDoc.scoring[0].correctResponse,
          value: responses[itemDoc.scoring[0].target],
          score: false,
          explanation: itemDoc.explanation,
          target: itemDoc.scoring[0].target,
          isUndefined: false
        })
      })
    })
    it('correctly scores true results', function () {
      const itemDoc = createItemDoc({
        correctResponse: /^[tfobarzw\s]*$/i,
        target: 1
      })

      const invalidInputs = [
        ['', 'woa'],
        ['', 'foo bar'],
        ['foo bar', 'bartz']
      ]

      invalidInputs.forEach((responses) => {
        const responseDoc = { itemId, responses }
        const score = Cloze.score(itemDoc, responseDoc)
        expect(score[0]).to.deep.equal({
          competency: itemDoc.scoring[0].competency,
          correctResponse: itemDoc.scoring[0].correctResponse,
          value: responses[itemDoc.scoring[0].target],
          score: true,
          itemId,
          explanation: itemDoc.explanation,
          target: itemDoc.scoring[0].target,
          isUndefined: false
        })
      })
    })
  })
})
