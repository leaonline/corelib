/* eslint-env mocha */
import { BrowserTTS } from '../BrowserTTS'
import { expect } from 'chai'
import { stub } from '../../test-helpers.tests'

describe('browser', function () {
  describe(BrowserTTS.name, function () {
    describe(BrowserTTS.isAvailable.name, function () {
      it('returns false if not initialized', function () {
        expect(BrowserTTS.isAvailable()).to.equal(false)
      })
    })
    describe(BrowserTTS.load.name, function () {
      it('loads internal defaults', function (done) {
        const defaultVoice = {
          name: 'foo',
          default: true,
          language: 'en-US',
          voiceURI: 'lea:foobar'
        }
        stub(window.speechSynthesis, 'getVoices', () => [defaultVoice])
        BrowserTTS.load({
          maxTimeout: 1000,
          onComplete (status) {
            expect(status.defaultVoice).to.deep.equal(defaultVoice)
            expect(status.initialized).to.deep.equal(true)
            expect(BrowserTTS.isAvailable()).to.equal(true)
            done()
          },
          onError: done
        })
      })
    })
    describe(BrowserTTS.play.name, function () {
      it('is not implemented')
    })
    describe(BrowserTTS.stop.name, function () {
      it('is not implemented')
    })
    describe(BrowserTTS.defaults.name, function () {
      it('is not implemented')
    })
  })
})
