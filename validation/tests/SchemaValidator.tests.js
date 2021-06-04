/* eslint-env mocha */
import { expect } from 'chai'
import { SchemaValidator } from '../SchemaValidator'

describe('SchemaValidator', function () {
  it('throws if no validator is set', function () {
    SchemaValidator.set(null)
    expect(() => SchemaValidator.get()).to.throw('SchemaValidator is not set')
  })
  it('allows to inject a custom validator', function (done) {
    SchemaValidator.set(null)
    const fn = () => done()
    SchemaValidator.set(fn)
    SchemaValidator.get()
  })
})
