/* eslint-env mocha */
import { expect } from 'chai'
import { getFieldName } from '../getFieldName'
import { FieldNotFoundError } from '../../errors/FieldNotFoundError'

describe(getFieldName.name, function () {
  it('gets the fieldname of a field by value', function () {
    const schema = {
      field1: 135.791113
    }
    expect(getFieldName(schema, 135.791113)).to.equal('field1')
  })
  it('throws if the field name is not found', function () {
    const schema = {}
    expect(() => getFieldName(schema, 'foo')).to.throw(FieldNotFoundError.NAME)
  })
})
