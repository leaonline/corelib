import { i18n } from '../i18n/i18n'

export const BrowserTTS = {}

let speechSynth
const _voices = {}
let _synthVoices


function loadVoicesWhenAvailable (onComplete = () => {}) {
  speechSynth = window.speechSynthesis
  const voices = speechSynth.getVoices()

  if (voices.length !== 0) {
    _synthVoices = voices
    onComplete()
  } else {
    return setTimeout(function () { loadVoicesWhenAvailable(onComplete) }, 100)
  }
}

const getVoices = (locale) => {
  if (!speechSynth) {
    throw new Error('Browser does not support speech synthesis')
  }
  if (_voices[locale]) return _voices[locale]

  let loadedVoices
  let count = 0
  const secure = 100
  while (!loadedVoices && count++ < secure) {
    loadedVoices = global.speechSynthesis.getVoices()
  }
  if (!loadedVoices) {
    throw new Error('Could not load voices!')
  }

  _voices[locale] = _synthVoices.filter(voice => voice.lang === locale)
  return _voices[locale]
}

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

  speechSynth.cancel()
  speechSynth.speak(utterance)
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
  speechSynth.cancel()
}

BrowserTTS.load = loadVoicesWhenAvailable
