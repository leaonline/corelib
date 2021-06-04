/* eslint-env mocha */
import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { MediaLib } from '../../contexts/MediaLib'
import { Labels } from '../../i18n/Labels'
import { createPageSchema, createPageEntrySchema } from '../pageSchema'

describe(createPageSchema.name, function () {
  it('returns a page schema definition object', function () {
    const label = Random.id()
    const pageSchema = createPageSchema({ label })
    expect(pageSchema).to.deep.equal({
      type: Array,
      label: label,
      isPageContent: true,
      optional: true,
      dependency: {
        filesCollection: MediaLib.name,
        version: 'original'
      }
    })
  })
})

describe(createPageEntrySchema.name, function () {
  it('returns a page entry schema definition', function () {
    const { custom, ...schema } = createPageEntrySchema()
    expect(schema).to.deep.equal({
      type: Object,
      optional: true,
      label: Labels.entry,
      blackbox: true
    })
  })

  if (Meteor.isServer) {
    it('contains a custom validation', function () {
      const { custom } = createPageEntrySchema()
      expect(custom.call({})).to.equal(undefined)
      expect(custom.call({ value: undefined })).to.equal(undefined)
      expect(custom.call({ value: null })).to.equal(undefined)

      const value = {
        type: Random.id(),
        subtype: Random.id(),
        contentId: Random.id(),
        width: '100'
      }
      expect(custom.call({ value: value })).to.equal(undefined)
    })
  }
})
