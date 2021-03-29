/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { validateItemDefinition } from '../validateItemDefinition'
import { SchemaValidator } from '../../validation/SchemaValidator'
import { Choice } from '../choice/Choice'
import { createSchema } from '../../test-helpers.tests'

SchemaValidator.set(function (...args) {
  const schema = createSchema(...args)
  return doc => schema.validate(doc)
})

describe(validateItemDefinition.name, function () {
  it('throws if the given Item is not registered', function () {
    expect(() => validateItemDefinition(Random.id(), {})).to.throw('items.unknownType [validation.failed]')
  })

  it('validates an item from schema', function () {
    expect(() => validateItemDefinition(Choice, {})).to.throw('item.flavor is required')
    expect(() => validateItemDefinition(Choice.name, {
      flavor: 1
    })).to.throw('item.shuffle is required')
  })
})
