import { i18n } from '../i18n/i18n'
import { ReactiveVar } from 'meteor/reactive-var'
import { createLog } from '../logging/createLog'

export const BrowserTTS = {}

BrowserTTS.name = 'ttsBrowser'

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

let loadVoiceCount = 0
let voicesLoaded = false
const loadSuccess = new ReactiveVar(false)

const internal = {
  voices: undefined,
  speechSynth: undefined,
  cache: new Map()
}

const debug = createLog({
  name: BrowserTTS.name,
  type: 'debug',
  devOnly: true
})

/**
 * Returns the first found voice for a given language code.
 */

function getVoices (locale) {
  if (!internal.speechSynth) {
    throw new Error('Browser does not support speech synthesis')
  }

  // skip until voices loader is complete
  if (!voicesLoaded) {
    return []
  }

  if (!internal.voices || internal.voices.length === 0) {
    throw new Error('No voices installed for speech synthesis')
  }

  if (!internal.cache.has(locale)) {
    const lowerCaseLocale = locale.toLocaleLowerCase()
    debug('find voice for locale', locale)
    const voicesForLocale = internal.voices.filter(voice => voice.lang.toLocaleLowerCase().includes(lowerCaseLocale))

    if (!voicesForLocale.length === 0) {
      throw new Error(`No voices found for locale [${locale}]`)
    }

    debug('found voices for locale', locale, voicesForLocale)
    internal.cache.set(locale, voicesForLocale)
  }

  return internal.cache.get(locale)
}

/**
 * Speak a certain text
 * @param locale the locale this voice requires
 * @param text the text to speak
 * @param onEnd callback if tts is finished
 * @param onError callback if tts has an internal error
 */

function playByText (locale, text, { volume, onEnd, onError }) {
  const voices = getVoices(locale)

  if (!voices?.length) {
    throw new Error('No voices found to create utterance')
  }

  // TODO load preference here, e.g. male / female etc.
  // TODO but for now we just use the first occurrence
  const utterance = new global.SpeechSynthesisUtterance(text)
  utterance.voice = voices[0]
  // utterance.pitch = 1
  // utterance.rate = 1
  // utterance.voiceURI = 'native'
  // utterance.rate = 1
  // utterance.pitch = 0.8
  // utterance.lang = voices[0].lang || locale

  // XXX: chrome won't play longer tts texts in one piece and stops after a few
  // words. We need to add an intervall here in order prevent this. See:
  // https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
  utterance.onstart = function (/* event */) {
    resumeInfinity(utterance)
  }

  utterance.onend = function (event) {
    clearTimeout(timeoutResumeInfinity)

    // pass the event along the handler as if it has been attached
    // directly to the utterance via utterance.onend = onEnd
    if (onEnd) {
      onEnd.call(this, event)
    }
  }

  if (onError) {
    utterance.onerror = function (event) {
      onError(event.error || event)
    }
  }

  clearTimeout(timeoutResumeInfinity) // make sure we have no mem-leak
  internal.speechSynth.cancel() // cancel current speak, if any is running
  internal.speechSynth.speak(utterance)
}

/**
 *
 * @param locale
 * @param id
 * @param onEnd
 * @param onError
 */
function playById (locale, id, { volume, onEnd, onError }) {
  const translated = i18n.get(id)
  if (!translated || translated === `${locale}.${id}`) {
    throw new Error(`Unknown TTS by id [${id}]`)
  }

  return playByText(locale, translated, { volume, onEnd, onError })
}

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

BrowserTTS.isAvailable = function () {
  return loadSuccess.get()
}

BrowserTTS.play = function play ({ id, text, volume, onEnd, onError }) {
  const locale = i18n.getLocale()

  if (text) {
    return playByText(locale, text, { volume, onEnd, onError })
  } else {
    return playById(locale, id, { volume, onEnd, onError })
  }
}

BrowserTTS.stop = function stop () {
  internal.speechSynth.cancel()
}

const MAX_LOAD_VOICES = 5

/**
 * retries until there have been voices loaded. No stopper flag included in this example.
 * Note that this function assumes, that there are voices installed on the host system.
 */
BrowserTTS.load = function loadVoicesWhenAvailable ({ onComplete = () => {}, onError = err => console.error(err) } = {}) {
  debug('count', loadVoiceCount)
  internal.speechSynth = window.speechSynthesis
  const loadedVoices = internal.speechSynth.getVoices()

  if (loadedVoices.length !== 0) {
    internal.voices = loadedVoices
    debug('voices loaded', internal.voices)
    voicesLoaded = true
    loadSuccess.set(true)
    return onComplete()
  }

  if (++loadVoiceCount > MAX_LOAD_VOICES) {
    loadSuccess.set(false)
    return onError(new Error(`Failed to load speech synthesis voices, after ${loadVoiceCount} retries.`))
  }

  return setTimeout(() => BrowserTTS.load({ onComplete, onError }), 100)
}

let timeoutResumeInfinity

function resumeInfinity (target) {
  if (!target && timeoutResumeInfinity) {
    console.warn('[BrowserTTS]: force-clear timeout')
    return clearTimeout(timeoutResumeInfinity)
  }

  window.speechSynthesis.resume()
  timeoutResumeInfinity = setTimeout(function () {
    resumeInfinity(target)
  }, 1000)
}
