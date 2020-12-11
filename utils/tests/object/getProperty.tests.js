/*eslint-env mocha */
import { expect } from 'chai'
import { getProperty } from '../../object/getProperty'

describe(getProperty.name, function () {
  it ('returns undefined if the target does not exist', function () {
    expect(getProperty()).to.equal(undefined)
    expect(getProperty(undefined, 'constructor')).to.equal(undefined)
    expect(getProperty(null, 'constructor')).to.equal(undefined)
  })

  it ('returns undefined if the target does not own the property', function () {
    [{}, [], 'foo', true, 1, new Date()].forEach(target => {
    expect(getProperty(target, 'constructor')).to.equal(undefined)
    expect(getProperty(target, '__proto__')).to.equal(undefined)
    expect(getProperty(target, 'toString')).to.equal(undefined)
    })
  })

  it ('returns the given property if it owns it', function () {
    const o = { foo: 'bar' }
    expect(getProperty(o, 'foo')).to.equal('bar')

    const fn = () => 'hello, world'
    Object.defineProperty(fn, 'bar', { enumerable: true, value: 'baz' })
    expect(getProperty(fn, 'bar')).to.equal('baz')
  })
})
