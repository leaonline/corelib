import { check, Match } from 'meteor/check'
import { i18n } from '../i18n/i18n'
import { TTSConfig } from './TTSConfig'
import { createLog } from '../logging/createLog'

/**
 * Requests an audio file from a given URL and aims ro play the result via
 * Audio (HTML Element).
 */
export const ServerTTS = {}

ServerTTS.name = 'TTSServer'

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

const urlCache = new Map()
const log = createLog({
  name: ServerTTS.name
})

let audio

function playAudio (url, onEnd, onError) {
  ServerTTS.stop()
  audio = new window.Audio(url)
  audio.addEventListener('ended', onEnd)
  audio.addEventListener('error', onError)
  audio.play()
}

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

ServerTTS.isAvailable = function () {
  return false
}

/**
 * Plays a TTS by given text (or translated text).
 * If no text is given or resolved, throws an immediate error.
 * The onEnd/onError handlers are related to the internal Audio player.
 *
 * @param {String} id and i18n translatable id
 * @param {String} text a text or word in human language
 * @param {Function} [onEnd] handler called when audio playing has ended
 * @param {Function} [onError] handler called, when audo playback raised errors
 */
ServerTTS.play = function play ({ id, text, onEnd, onError } = {}) {
  const resolvedText = text || i18n.get(id)
  check(resolvedText, String)
  check(onEnd, Match.Maybe(Function))
  check(onError, Match.Maybe(Function))

  // let's trim the resolved text to ensure consistency
  const requestText = resolvedText.trim()
  const cachedUrl = urlCache.get(requestText)

  if (cachedUrl) {
    return playAudio(cachedUrl, onEnd, onError)
  }

  const loader = TTSConfig.urlLoader()
  if (typeof loader !== 'function') {
    throw new TypeError(`Expected a function from ${TTSConfig.urlLoader.name}.`)
  }

  loader(requestText, (err, url) => {
    const errorTarget = onError || log
    if (err) {
      return errorTarget(err)
    }

    if (typeof url !== 'string') {
      return errorTarget(new TypeError('Invalid response, expected string url'))
    }

    urlCache.set(requestText, url)
    playAudio(url, onEnd, onError)
  })
}

ServerTTS.stop = function stop () {
  if (audio) {
    audio.pause()
    const event = new window.Event('ended')
    audio.dispatchEvent(event)
  }
}

ServerTTS.urlIsCached = function urlIsCached (requestText) {
  return urlCache.has(requestText)
}

ServerTTS.clear = function () {
  if (audio) {
    audio = null
  }
}

ServerTTS.defaults = () => {}
