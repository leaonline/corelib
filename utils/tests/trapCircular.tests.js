/* eslint-env mocha */
import { expect } from 'chai'
import { Random } from 'meteor/random'
import { trapCircular } from '../trapCircular'

describe(trapCircular.name, function () {
  it('returns a proxy', function () {
    const id = Random.id()
    const proxy = trapCircular(() => ({ id }))
    expect(proxy.id).to.equal(id)
    expect(JSON.stringify(proxy)).to.deep.equal(JSON.stringify({ id }))
  })
})
