import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { BrowserTTS } from './BrowserTTS'
import { ServerTTS } from './ServerTTS'
import { TTSConfig } from './TTSConfig'

export const TTSEngine = {}

TTSEngine.modes = {
  server: 'server',
  browser: 'browser'
}

const log = (...args) => Meteor.isDevelopment && console.log('[TTSEngine]:', ...args)

TTSEngine.configure = function ({ ttsUrl, mode }) {
  check(ttsUrl, String)

  TTSEngine.mode = mode || TTSEngine.modes.server
  log('set mode to', TTSEngine.mode)
  TTSConfig.url(ttsUrl)
  log('set url to', TTSConfig.url())
  BrowserTTS.load()
}

TTSEngine.play = function ({ id, text, onEnd }) {
  const fallback = () => {
    BrowserTTS.play({ id, text, onEnd })
    TTSEngine.mode = TTSEngine.modes.browser
  }
  if (TTSEngine.mode === TTSEngine.modes.server) {
    const onError = err => {
      log('failed with an error. Attempt fallback. Error details:', err)
      fallback()
    }
    ServerTTS.play({ id, text, onEnd, onError })
  } else {
    fallback()
  }
}

TTSEngine.stop = function () {
  if (TTSEngine.mode === TTSEngine.modes.server) {
    ServerTTS.stop()
  } else {
    BrowserTTS.stop()
  }
}
