import { i18n } from '../i18n/i18n'
import { ReactiveVar } from 'meteor/reactive-var'
import { createLog } from '../logging/createLog'
import EasySpeech from 'easy-speech'

export const BrowserTTS = {}

BrowserTTS.name = 'ttsBrowser'

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

const internal = {
  locale: undefined,
  initialized: new ReactiveVar(false),
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

BrowserTTS.play = function play ({ id, text, volume, onEnd, onError }) {
  const locale = i18n.getLocale()

  if (locale && internal.locale !== locale) {
    debug(`change locale from ${internal.locale} to ${locale}; load new voice`)

    const voices = EasySpeech.voices()

    let newVoice = voices.find(v => v.lang === locale)

    if (!newVoice) {
      const localePrefix = (locale || '').toLowerCase().split(/[-_]/)[0]
      const prefixMinus = `${localePrefix}-`
      const prefixUnderscore = `${localePrefix}_`

      debug('found no voice with exact match, try prefix', localePrefix)

      newVoice = voices.find(v => {
        if (!v.lang) { return false }

        const lowerCaseVoice = v.lang.toLowerCase()

        return (lowerCaseVoice === localePrefix ||
          lowerCaseVoice.startsWith(prefixMinus) ||
          lowerCaseVoice.startsWith(prefixUnderscore) ||
          lowerCaseVoice.startsWith(localePrefix))
      })

      if (!newVoice) {
        const details = {
          locale,
          localePrefix,
          voices: internal.speechSynthesis.getVoices()
            .filter(v => v.lang.includes(localePrefix))
            .map(v =>({ name: v.name, lang: v.lang }))
        }
        const voiceNotFoundError = new Meteor.Error('tts.error', 'tts.voiceNotFound', details)

        if (onError) {
          onError(voiceNotFoundError)
        }
        else {
          console.error(voiceNotFoundError)
        }
      }
    }

    if (newVoice) {
      debug('assign new voice', newVoice.name)
      internal.locale = locale
      EasySpeech.defaults({ voice: newVoice })
    }
  }

  const textToSpeak = text || i18n.get(id)

  EasySpeech.speak({ text: textToSpeak, volume: volume })
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
      internal.initialized.set(true)
      onComplete(EasySpeech.status())
    })
    .catch(e => onError(e))
}

