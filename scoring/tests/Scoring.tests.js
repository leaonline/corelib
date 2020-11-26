/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { Scoring } from '../Scoring'
import { ScoringTypes } from '../ScoringTypes'

describe(Scoring.name, function () {
  it ('ensures integrity of it\'s base structure',function () {
    expect(Scoring.name).to.be.a('string')
    expect(Scoring.label).to.be.a('string')
    expect(Scoring.UNDEFINED).to.equal('__undefined__')
    expect(Scoring.types).to.deep.equal(ScoringTypes)
  })

  describe(Scoring.init.name, function () {
    it ('is not implemented')
  })
  describe(Scoring.register.name, function () {
    it ('registers a scoring function by key', function () {
      const key = Random.id()
      const fct = () => key
      Scoring.register(key, fct)
      expect(Scoring.has(key)).to.equal(true)
    })
  })
  describe(Scoring.has.name, function () {
    it ('returns false if no function is registered by key', function () {
      expect(Scoring.has(Random.id())).to.equal(false)
    })
  })
  describe(Scoring.run.name, function () {
    it ('runs a scoring fn by name with args', function () {
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
  })
})