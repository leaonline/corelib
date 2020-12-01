import { i18n } from '../i18n/i18n'

export const BrowserTTS = {}

BrowserTTS.name = 'ttsBrowser'

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

const MAX_LOAD_VOICES = 5
let loadVoiceCount = 0
let speechSynth
let voices
let voicesLoaded = false
const cache = new Map()

/**
 * Returns the first found voice for a given language code.
 */

function getVoices (locale) {
  if (!speechSynth) {
    throw new Error('Browser does not support speech synthesis')
  }

  // skip until voices loader is complete
  if (!voicesLoaded) {
    return []
  }

  if (!voices || voices.length === 0) {
    throw new Error('No voices installed for speech synthesis')
  }

  if (!cache.has(locale)) {
    const voicesForLocale = voices.filter(voice => voice.lang === locale)
    if (!voicesForLocale.length === 0) {
      throw new Error(`No voices found for locale [${locale}]`)
    }

    cache.set(locale, voicesForLocale)
  }

  return cache.get(locale)
}

/**
 * Speak a certain text
 * @param locale the locale this voice requires
 * @param text the text to speak
 * @param onEnd callback if tts is finished
 */

function playByText (locale, text, { onEnd }) {
  const voices = getVoices(locale)

  // TODO load preference here, e.g. male / female etc.
  // TODO but for now we just use the first occurrence
  const utterance = new global.SpeechSynthesisUtterance()
  utterance.voice = voices[0]
  utterance.pitch = 1
  utterance.rate = 1
  utterance.voiceURI = 'native'
  utterance.volume = 1
  utterance.rate = 1
  utterance.pitch = 0.8
  utterance.text = text
  utterance.lang = i18n.getLocale() || 'de-DE'

  if (onEnd) {
    utterance.onend = onEnd
  }

  speechSynth.cancel() // cancel current speak, if any is running
  speechSynth.speak(utterance)
}

/**
 *
 * @param locale
 * @param id
 * @param onEnd
 */
function playById (locale, id, { onEnd }) {
  const translated = i18n.get(id)
  if (!translated || translated === `${locale}.${id}`) {
    throw new Error(`Unknown TTS by id [${id}]`)
  }
  return playByText(locale, translated, { onEnd })
}

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

BrowserTTS.play = function play ({ id, text, onEnd }) {
  const locale = i18n.getLocale()
  if (text) {
    return playByText(locale, text, { onEnd })
  } else {
    return playById(locale, id, { onEnd })
  }
}

BrowserTTS.stop = function stop () {
  speechSynth.cancel()
}

/**
 * retries until there have been voices loaded. No stopper flag included in this example.
 * Note that this function assumes, that there are voices installed on the host system.
 */

BrowserTTS.load = function loadVoicesWhenAvailable ({ onComplete = () => {}, onError = err => console.error(err) } = {}) {
  speechSynth = window.speechSynthesis
  const loadedVoices = speechSynth.getVoices()

  if (loadedVoices.length !== 0) {
    voices = loadedVoices
    voicesLoaded = true
    return onComplete()
  }

  if (++loadVoiceCount > MAX_LOAD_VOICES) {
    return onError(new Error(`Failed to load speech synthesis voices, after ${loadVoiceCount} retries.`))
  }

  return setTimeout(() => BrowserTTS.load({ onComplete, onError }), 100)
}

