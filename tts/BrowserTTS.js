import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
import { createLog } from '../logging/createLog'
import EasySpeech from 'easy-speech/dist/EasySpeech.js'
import { i18n } from '../i18n/i18n'

export const BrowserTTS = {}

BrowserTTS.name = 'ttsBrowser'

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

const internal = {
  locale: undefined,
  initialized: new ReactiveVar(false)
}

const debug = createLog({
  name: BrowserTTS.name,
  type: 'debug',
  devOnly: true
})

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

BrowserTTS.isAvailable = function () {
  return internal.initialized.get()
}

BrowserTTS.defaults = ({ volume, rate, pitch }) => EasySpeech.defaults({ volume, rate, pitch })

BrowserTTS.play = function play ({ id, text, rate, pitch, volume, onEnd, onError }) {
  updateVoices({ locale: i18n.getLocale() })
  const textToSpeak = text || i18n.get(id)

  EasySpeech.speak({ text: textToSpeak, volume, rate, pitch })
    .then((endEvent) => onEnd(endEvent))
    .catch(error => onError(error))
}

BrowserTTS.stop = function stop () {
  return EasySpeech.cancel()
}

BrowserTTS.load = function load ({ onComplete = () => {}, onError = err => console.error(err) } = {}) {
  EasySpeech.debug(debug)
  EasySpeech.init()
    .then(() => {
      try {
        updateVoices({
          locale: i18n.getLocale(),
          onError
        })
      } catch (e) {
        return onError(e)
      }

      internal.initialized.set(true)
      onComplete(EasySpeech.status())
    })
    .catch(e => onError(e))
}

const updateVoices = ({ locale, onError }) => {
  if (!locale || internal.locale === locale) {
    return debug('update voices: skip', locale, internal.locale)
  }

  debug(`update voices: from ${internal.locale} to ${locale}`)

  const voices = EasySpeech.voices()
  let filteredVoices = voices.filter(v => v.lang === locale)
  const getBestMatch = list => {
    debug('get best match by: "google"')

    // google voices are usually remote voices that
    // provide a decent quality so we aim for them first
    let selectedVoice = list.find(v => {
      const name = v.name.toLowerCase()
      const uri = v.voiceURI.toLowerCase()
      const pattern = 'google'
      return name.includes(pattern) || uri.includes(pattern)
    })

    // try to blind-pick some common names
    if (!selectedVoice) {
      debug('get best match by: common name')
      const systemRegex = /siri|cortana|anna|markus|petra|viktor|yannik/i
      selectedVoice = list.find(v => {
        const name = v.name.toLowerCase()
        const uri = v.voiceURI.toLowerCase()
        return systemRegex.test(name) || systemRegex.test(uri)
      })
    }

    // alternatively we try to get any matching system voices
    if (!selectedVoice) {
      debug('get best match by: system')
      const systemRegex = /microsoft|apple|android|ios/i
      selectedVoice = list.find(v => {
        const name = v.name.toLowerCase()
        const uri = v.voiceURI.toLowerCase()
        return systemRegex.test(name) || systemRegex.test(uri)
      })
    }

    // if all this won't work we fall back to looking for the default flag
    if (!selectedVoice) {
      debug('get best match by: default flag')
      selectedVoice = list.find(v => v.default)
    }

    // last resort: pick the first voice
    if (!selectedVoice) {
      debug('get best match by: fallback')
      selectedVoice = list[0]
    }

    return selectedVoice
  }

  const selectVoice = voice => {
    debug('assign new voice', voice.name)
    internal.locale = locale
    EasySpeech.defaults({ voice })
  }

  // we need to maximize our effort to load google voices
  // as they provide a coherent
  if (filteredVoices.length > 0) {
    return selectVoice(getBestMatch(filteredVoices))
  } else {
    // Step 1: no voice found for the current locale
    // --> make regex pattern that fits locale
    // --> search voices for pattern
    const localePrefix = (locale || '').toLowerCase().split(/[-_]/)[0]
    const prefixMinus = `${localePrefix}-`
    const prefixUnderscore = `${localePrefix}_`

    debug('found no voice with exact match, try prefix', localePrefix)

    filteredVoices = voices.filter(v => {
      if (!v.lang) { return false }

      const lowerCaseVoice = v.lang.toLowerCase()
      const uri = v.voiceURI.toLowerCase()

      return (lowerCaseVoice === localePrefix ||
        lowerCaseVoice.startsWith(prefixMinus) ||
        lowerCaseVoice.startsWith(prefixUnderscore) ||
        lowerCaseVoice.startsWith(localePrefix)) ||
        uri.includes(prefixMinus) ||
        uri.includes(prefixUnderscore)
    })

    if (filteredVoices.length === 0) {
      debug('found no voice with prefix', localePrefix, ', try ')
    }

    if (filteredVoices.length > 0) {
      return selectVoice(getBestMatch(filteredVoices))
    } else {
      const details = {
        locale,
        localePrefix,
        voices: internal.speechSynthesis.getVoices()
          .filter(v => v.lang.includes(localePrefix))
          .map(v => ({ name: v.name, lang: v.lang }))
      }
      const voiceNotFoundError = new Meteor.Error('tts.error', 'tts.voiceNotFound', details)

      return typeof onError === 'function'
        ? onError(voiceNotFoundError)
        : console.error(voiceNotFoundError)
    }
  }
}
