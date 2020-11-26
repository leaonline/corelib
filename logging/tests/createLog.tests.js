/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { createLog, logTypes } from '../createLog'
import { getProperty } from '../../utils/object/getProperty'

describe(createLog.name, function () {
  let id

  beforeEach(function () {
    id = Random.id()
  })

  it ('throws on unsupported types', function () {
    ['', 'foo', Random.id(), 0, 1, false, true].forEach(type => {
      expect(() => createLog({
        name: id,
        type: type
      })).to.throw(`Unsupported type ${type}.`)
    })
  })


  logTypes.forEach(type => {
    describe(type, function () {
      it('creates a logger', function (done) {

        const value = Random.id()
        const target = getProperty(console, type)
        console[type] = function (...args) {
          expect(args[0]).to.equal(`[${id}]:`)
          expect(args[1]).to.equal(value)
          console[type] = target
          done()
        }

        const logger = createLog({
          name: id,
          type: type
        })

        logger(value)
      })
    })
  })
})