/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Scoring } from '../Scoring'
import { ScoringTypes } from '../ScoringTypes'
import { Cloze } from '../../items/text/Cloze'
import { Choice } from '../../items/choice/Choice'
import { Highlight } from '../../items/highlight/Highlight'
import { restore, stub } from '../../test-helpers.tests'

describe(Scoring.name, function () {
  it('ensures integrity of it\'s base structure', function () {
    expect(Scoring.name).to.be.a('string')
    expect(Scoring.label).to.be.a('string')
    expect(Scoring.UNDEFINED).to.equal('__undefined__')
    expect(Scoring.types).to.deep.equal(ScoringTypes)
  })
  describe(Scoring.register.name, function () {
    it('registers a scoring function by key', function () {
      const key = Random.id()
      const fct = () => key
      Scoring.register(key, fct)
      expect(Scoring.has(key)).to.equal(true)
    })
  })
  describe(Scoring.has.name, function () {
    it('returns false if no function is registered by key', function () {
      expect(Scoring.has(Random.id())).to.equal(false)
    })
  })
  describe(Scoring.run.name, function () {
    it('runs a scoring fn by name with args', function () {
      const key = Random.id()
      const fct = (p1, p2) => {
        return `${key}-${p1}-${p2}`
      }
      Scoring.register(key, fct)

      const value1 = Random.id()
      const value2 = Random.id()
      const expected = `${key}-${value1}-${value2}`
      const value = Scoring.run(key, value1, value2)
      expect(value).to.equal(expected)
    })
    it('throws if there is no scoring function registered by name', function () {
      const key = Random.id()
      expect(() => Scoring.run(key)).to.throw(`Expected score function by key <${key}>`)
    })
  })
  describe(Scoring.init.name, function () {
    it('loads default items dynamically', async function () {
      expect(Scoring.has(Cloze.name)).to.equal(false)
      expect(Scoring.has(Choice.name)).to.equal(false)
      expect(Scoring.has(Highlight.name)).to.equal(false)
      await Scoring.init()
      expect(Scoring.has(Cloze.name)).to.equal(true)
      expect(Scoring.has(Choice.name)).to.equal(true)
      expect(Scoring.has(Highlight.name)).to.equal(true)

      // ensure we cover to check that it runs only once
      stub(Scoring, 'register', () => expect.fail())
      await Scoring.init()
      await Scoring.init()
      await Scoring.init()
      await Scoring.init()
      await Scoring.init()
      restore(Scoring, 'register')
    })
  })
})
