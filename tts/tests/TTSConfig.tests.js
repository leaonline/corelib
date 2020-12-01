/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { TTSConfig } from '../TTSConfig'

describe(TTSConfig.name, function () {

  afterEach(function () {
    TTSConfig.urlLoader(null)
  })
  it('has no url set by default', function () {
    expect(TTSConfig.urlLoader()).to.equal(undefined)
  })

  it('allows to set an url from where TTS can be obtained', function () {
    const id = Random.id()
    TTSConfig.urlLoader(() => id)
    expect(TTSConfig.urlLoader()()).to.equal(id)
  })
})
