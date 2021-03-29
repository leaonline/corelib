/* eslint-env mocha */
import { expect } from 'chai'

import { SchemaOptions } from '../SchemaOptions'

describe('SchemaOptions', function () {
  it('keeps integrity of the structure', function () {
    expect(SchemaOptions).to.deep.equal({
      unique: Boolean,
      list: Boolean,
      richText: Boolean,
      isMediaUrl: Boolean,
      dependency: {
        collection: String,
        field: String
      },
      value: {
        method: String,
        input: Array
      },
      autoform: Object,
      options: Array,
      group: String,
      isPageContent: Boolean,
      isSortable: Boolean
    })
  })
})
