/* eslint-env mocha */
import { expect } from 'chai'
import { MediaLib } from '../MediaLib'
import { createSchema } from '../../test-helpers.tests'

const allFileContexts = [
  MediaLib,
]

const extensionsSchema = createSchema({
  extensions: Array,
  'extensions.$': String
})

describe('file-contexts', function () {
  allFileContexts.forEach(fileContext => {
    describe(fileContext.name, function () {
      it ('contains an isFilesContext flag', function () {
        expect(fileContext.isFilesCollection).to.equal(true)
      })
      it ('contains an original entry', function () {
        expect(fileContext.original).to.be.a('string')
      })
      it ('contains an optional preview entry', function () {
        if (!fileContext.preview) return
        expect(fileContext.preview).to.be.a('string')
      })
      it ('contains an accept entry', function () {
        const { accept } = fileContext
        if (typeof accept !== 'string' && !Array.isArray(accept)) {
          expect.fail('Expected accept to be string or array')
        }
      })
      it ('contains an extensions list', function () {
        const { extensions } = fileContext
        extensionsSchema.validate({ extensions })
      })
    })
  })
})