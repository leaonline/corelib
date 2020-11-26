/* eslint-env mocha */
import { expect } from 'chai'
import { Items } from '../Items'
import { ItemTypeName } from '../ItemTypeName'

describe(Items.name, function () {
  it ('keeps integrity for basic structure', function () {
    expect(Items.name).to.be.a('string')
    expect(Items.typeName).to.equal(ItemTypeName)
    expect(Items.forEach).to.be.a('function')
    expect(Items.get).to.be.a('function')
  })
})