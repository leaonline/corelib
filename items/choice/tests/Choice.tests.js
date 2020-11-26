/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Choice } from '../Choice'
import '../score'
import { createSchema } from '../../../test-helpers.tests'
import { UndefinedScore } from '../../../scoring/UndefinedScore'
import { ScoringTypes } from '../../../scoring/ScoringTypes'

describe(Choice.name, function () {
  it('ensures the integrity of the basic structure', function () {
    expect(Choice.name).to.equal('choice')
    expect(Choice.label).to.be.a('string')
    expect(Choice.icon).to.be.a('string')
    expect(Choice.isItem).to.equal(true)
    expect(Choice.flavors).to.deep.equal({
      single: {
        name: 'single',
        value: 1,
        label: 'item.choice.single'
      },
      multiple: {
        name: 'multiple',
        value: 2,
        label: 'item.choice.multiple'
      }
    })
  })

  it('has a valid schema', function () {
    createSchema(Choice.schema)
  })

  describe('scoring', function () {

    const createItemDoc = ({ flavor = 0, correctResponse = 0, requires = 0 } = {}) => ({
      flavor: flavor,
      scoring: [{
        competency: Random.id(),
        correctResponse: Array.isArray(correctResponse)
          ? correctResponse
          : [correctResponse],
        requires: requires
      }]
    })

    describe('validation', function () {
      it('throws on an unexpected flavor', function () {
        expect(() => Choice.score()).to.throw('Expected number, got undefined')

        const itemDoc = createItemDoc({ flavor: 3 })
        expect(() => Choice.score(itemDoc)).to.throw(`Unexpected undefined choice flavor ${itemDoc.flavor}`)
      })
      it('throws on unexpected scoring def', function () {
        expect(() => Choice.score()).to.throw('Expected number, got undefined')

        const itemDoc = createItemDoc({
          flavor: Choice.flavors.single.value,
          correctResponse: null
        })
        expect(() => Choice.score(itemDoc)).to.throw(`Match error: Expected number, got null in field [0].correctResponse[0]`)
        expect(() => Choice.score({
          flavor: Choice.flavors.single.value
        })).to.throw('Match error: Expected array, got undefined')
      })
    })

    describe(Choice.flavors.single.name, function () {
      it('correctly scores an undefined result', function () {
        const itemDoc = createItemDoc({
            flavor: Choice.flavors.single.value,
            correctResponse: 1
          })
        ;[
          undefined,
          [],
          [[]],
          [''],
          [undefined],
          [null],
          [UndefinedScore]
        ].forEach(responses => {
            const score = Choice.score(itemDoc, { responses })
            const expectedValue = Array.isArray(responses)
              ? responses[0]
              : responses

            expect(score[0]).to.deep.equal({
              competency: itemDoc.scoring[0].competency,
              correctResponse: itemDoc.scoring[0].correctResponse,
              value: expectedValue,
              score: false,
              isUndefined: true
            }, responses)
          })
      })

      it ('throws on a faulty result format', function () {
        const itemDoc = createItemDoc({
            flavor: Choice.flavors.single.value,
            correctResponse: 1
          })

        ;[[1.1], [true], [new Date()], [new RegExp('1')], [{}], [() => {}]].forEach(responses => {
            expect(() => Choice.score(itemDoc, { responses }))
              .to.throw('Match error: Failed Match.OneOf, Match.Maybe or Match.Optional validation')
          })
      })

      it('correctly scores a true result', function () {
        const itemDoc = createItemDoc({
          flavor: Choice.flavors.single.value,
          correctResponse: 1
        })

        ;[[1], ['1'], [1.0], ['1.0']]
          .forEach(responses => {
            const score = Choice.score(itemDoc, { responses })
            const expectedValue = Array.isArray(responses)
              ? responses[0]
              : responses

            expect(score[0]).to.deep.equal({
              competency: itemDoc.scoring[0].competency,
              correctResponse: itemDoc.scoring[0].correctResponse,
              value: parseInt(expectedValue, 10),
              score: true,
              isUndefined: false
            }, responses)
          })
      })

      it ('correctly scores a false result', function () {
        const itemDoc = createItemDoc({
            flavor: Choice.flavors.single.value,
            correctResponse: 23
          })

        ;[[22], ['22'], [1.0], ['1']]
          .forEach(responses => {
            const score = Choice.score(itemDoc, { responses })
            const expectedValue = Array.isArray(responses)
              ? responses[0]
              : responses

            expect(score[0]).to.deep.equal({
              competency: itemDoc.scoring[0].competency,
              correctResponse: itemDoc.scoring[0].correctResponse,
              value: parseInt(expectedValue, 10),
              score: false,
              isUndefined: false
            }, responses)
          })
      })
    })

    describe(Choice.flavors.multiple.name, function () {
      it('throws on an unexpected requires type', function () {
        const itemDoc = createItemDoc({
          flavor: Choice.flavors.multiple.value,
          requires: -10
        })
        const responseDoc = {
          responses: ['2']
        }
        expect(() => Choice.score(itemDoc, responseDoc))
          .to.throw(`Unexpected scoring type -10`)
      })
      it('correctly scores an undefined result', function () {
        const itemDoc = createItemDoc({
            flavor: Choice.flavors.single.value,
            correctResponse: 1
          })
        ;[
          undefined,
          [],
          [[]],
          [''],
          [['']],
          [undefined],
          [[undefined]],
          [null],
          [[null]],
          [UndefinedScore]
        ].forEach(responses => {
          const score = Choice.score(itemDoc, { responses })
          const expectedValue = Array.isArray(responses)
            ? responses[0]
            : responses

          expect(score[0]).to.deep.equal({
            competency: itemDoc.scoring[0].competency,
            correctResponse: itemDoc.scoring[0].correctResponse,
            value: expectedValue,
            score: false,
            isUndefined: true
          }, responses)
        })
      })

      describe(ScoringTypes.any.name, function () {
        it('throws on a faulty result format', function () {
          const itemDoc = createItemDoc({
              flavor: Choice.flavors.multiple.value,
              correctResponse: [2, 3],
              requires: ScoringTypes.any.value
            })

          ;[[1.1], [true], [new Date()], [new RegExp('1')], [{}], [() => {}]].forEach(responses => {
              expect(() => Choice.score(itemDoc, { responses }))
                .to.throw('Match error: Failed Match.OneOf, Match.Maybe or Match.Optional validation')
          })
        })
        it ('correctly scores a false result', function () {
          const itemDoc = createItemDoc({
              flavor: Choice.flavors.multiple.value,
              correctResponse: [2, 3],
              requires: ScoringTypes.any.value
            })

          ;[[0], [1], [0, 1], [-1, 0, 4]]
            .forEach(responses => {
              const score = Choice.score(itemDoc, { responses })

              expect(score[0]).to.deep.equal({
                competency: itemDoc.scoring[0].competency,
                correctResponse: itemDoc.scoring[0].correctResponse,
                value: responses,
                score: false,
                isUndefined: false
              }, responses)
            })
        })
        it ('correctly scores a true result', function () {
          const itemDoc = createItemDoc({
              flavor: Choice.flavors.multiple.value,
              correctResponse: [2, 3],
              requires: ScoringTypes.any.value
            })

          ;[[1, 2], [1, 2, 3], [1, 3.0], ['2.0', '3']]
            .forEach(responses => {
              const score = Choice.score(itemDoc, { responses })

              expect(score[0]).to.deep.equal({
                competency: itemDoc.scoring[0].competency,
                correctResponse: itemDoc.scoring[0].correctResponse,
                value: responses,
                score: true,
                isUndefined: false
              }, responses)
            })
        })
      })

      describe(ScoringTypes.all.name, function () {
        it('throws on a faulty result format', function () {
          const itemDoc = createItemDoc({
              flavor: Choice.flavors.multiple.value,
              correctResponse: [2, 3],
              requires: ScoringTypes.all.value
            })

          ;[[1.1], [true], [new Date()], [new RegExp('1')], [{}], [() => {}]].forEach(responses => {
            expect(() => Choice.score(itemDoc, { responses }))
              .to.throw('Match error: Failed Match.OneOf, Match.Maybe or Match.Optional validation')
          })
        })
        it ('correctly scores a false result', function () {
          const itemDoc = createItemDoc({
              flavor: Choice.flavors.multiple.value,
              correctResponse: [2, 3],
              requires: ScoringTypes.all.value
            })

          ;[[1,2,3], [2,3,4], [0, 1], [2], [3]]
            .forEach(responses => {
              const score = Choice.score(itemDoc, { responses })

              expect(score[0]).to.deep.equal({
                competency: itemDoc.scoring[0].competency,
                correctResponse: itemDoc.scoring[0].correctResponse,
                value: responses,
                score: false,
                isUndefined: false
              }, responses)
            })
        })
        it ('correctly scores a true result', function () {
          const itemDoc = createItemDoc({
              flavor: Choice.flavors.multiple.value,
              correctResponse: [2, 3],
              requires: ScoringTypes.all.value
            })

          ;[[2, 3], ['2.0', '3']]
            .forEach(responses => {
              const score = Choice.score(itemDoc, { responses })

              expect(score[0]).to.deep.equal({
                competency: itemDoc.scoring[0].competency,
                correctResponse: itemDoc.scoring[0].correctResponse,
                value: responses,
                score: true,
                isUndefined: false
              }, responses)
            })
        })
      })

    })
  })
})
