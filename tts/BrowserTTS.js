import { i18n } from '../i18n/i18n'

export const BrowserTTS = {}

let _speechSynth
let _voices
const _cache = {}

/**
 * retries until there have been voices loaded. No stopper flag included in this example.
 */

function loadVoicesWhenAvailable (onComplete = () => {}) {
  _speechSynth = window.speechSynthesis
  const voices = _speechSynth.getVoices()

  if (voices.length !== 0) {
    _voices = voices
    onComplete()
  } else {
    return setTimeout(function () { loadVoicesWhenAvailable(onComplete) }, 100)
  }
}

/**
 * Returns the first found voice for a given language code.
 */

const getVoices = (locale) => {
  if (!_speechSynth) {
    throw new Error('Browser does not support speech synthesis')
  }
  if (_cache[locale]) return _cache[locale]

  let loadedVoices
  let count = 0
  const secure = 100
  while (!loadedVoices && count++ < secure) {
    loadedVoices = global.speechSynthesis.getVoices()
  }
  if (!loadedVoices) {
    throw new Error('Could not load voices!')
  }

  _cache[locale] = _voices.filter(voice => voice.lang === locale)
  return _cache[locale]
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
  utterance.lang = 'de-DE'

  if (onEnd) {
    utterance.onend = onEnd
  }

  _speechSynth.cancel() // cancel current speak, if any is running
  _speechSynth.speak(utterance)
}

function playById (locale, id, { onEnd }) {
  const translated = i18n.get(id)
  if (!translated || translated === `${locale}.${id}`) {
    throw new Error(`Unknown TTS by id [${id}]`)
  }
  return playByText(locale, translated, { onEnd })
}

BrowserTTS.play = function ({ id, text, onEnd }) {
  const locale = i18n.getLocale()
  if (text) {
    return playByText(locale, text, { onEnd })
  } else {
    return playById(locale, id, { onEnd })
  }
}

BrowserTTS.stop = function () {
  _speechSynth.cancel()
}

BrowserTTS.load = loadVoicesWhenAvailable
