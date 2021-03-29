/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { ServerTTS } from '../ServerTTS'
import { TTSConfig } from '../TTSConfig'

class CustomAudio extends window.EventTarget {
  constructor (url) {
    super()
    this.url = url
    this.paused = false
  }

  play () {
    setTimeout(() => {
      this.dispatchEvent(new window.Event('ended', {
        url: this.url,
        paused: this.paused
      }))
    })
  }

  pause () {
    this.paused = true
  }
}
window.Audio = CustomAudio

describe(ServerTTS.name, function () {
  describe(ServerTTS.play.name, function () {
    afterEach(function () {
      ServerTTS.clear()
    })

    it('throws on missing or unexpected args', function () {
      const onEnd = Random.id()
      const onError = 1
      expect(() => ServerTTS.play())
        .to.throw('Match error: Expected string, got undefined')
      expect(() => ServerTTS.play({}))
        .to.throw('Match error: Expected string, got undefined')
      expect(() => ServerTTS.play({ text: Random.id(), onEnd }))
        .to.throw('Match error: Failed Match.OneOf, Match.Maybe or Match.Optional validation')
      expect(() => ServerTTS.play({ text: Random.id(), onError }))
        .to.throw('Match error: Failed Match.OneOf, Match.Maybe or Match.Optional validation')
    })

    it('throws if no loader is defined', function () {
      TTSConfig.urlLoader(null)

      const text = Random.id()
      expect(() => ServerTTS.play({ text }))
        .to.throw(`Expected a function from ${TTSConfig.urlLoader.name}.`)
    })

    it('routes error to the callback', function (done) {
      const errMessage = Random.id()
      const expectedText = Random.id()
      const onError = err => {
        expect(err.message).to.equal(errMessage)
        done()
      }

      TTSConfig.urlLoader(function (text, callback) {
        expect(text).to.equal(expectedText)
        setTimeout(() => callback(new Error(errMessage)))
      })

      ServerTTS.play({ text: expectedText, onError })
    })

    it('routes to the audio playback on successful url load', function (done) {
      const expectedText = Random.id()
      const url = Random.id()
      const onEnd = () => {
        expect(ServerTTS.urlIsCached(expectedText)).to.equal(true)
        done()
      }
      const onError = err => {
        console.error('error callback', err)
        done(err)
      }

      TTSConfig.urlLoader(function (text, callback) {
        expect(text).to.equal(expectedText)
        setTimeout(() => callback(null, url))
      })

      ServerTTS.play({ text: expectedText, onError, onEnd })
    })
  })

  describe(ServerTTS.stop.name, function () {
    it('stops and dispatches the ended event', function (done) {
      const expectedText = Random.id()
      const url = Random.id()
      let count = 0
      const onEnd = () => {
        if (++count === 2) {
          done()
        }
      }
      const onError = err => {
        console.error('error callback', err)
        done(err)
      }

      TTSConfig.urlLoader(function (text, callback) {
        expect(text).to.equal(expectedText)
        setTimeout(() => callback(null, url))
      })

      ServerTTS.play({ text: expectedText, onError, onEnd })

      setTimeout(() => ServerTTS.stop(), 10)
    })
  })
})
