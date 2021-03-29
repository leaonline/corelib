import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { BrowserTTS } from './BrowserTTS'
import { ServerTTS } from './ServerTTS'
import { TTSConfig } from './TTSConfig'
import { createLog } from '../logging/createLog'

export const TTSEngine = {}

TTSEngine.name = 'TTSEngine'

TTSEngine.modes = {

  /**
   * Use an external server to render TTS
   */
  server: 'server',

  /**
   * Use the current browser / webview to render TTS
   */
  browser: 'browser'
}

// /////////////////////////////////////////////////////////////////////////////
//
// INTERNAL
//
// /////////////////////////////////////////////////////////////////////////////

const log = createLog({
  name: TTSEngine.name,
  devOnly: true
})

let isConfigured = false

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

TTSEngine.configure = function configure ({ loader, mode = (TTSEngine.mode || TTSEngine.modes.browser) }) {
  check(loader, Function)
  check(mode, String)

  if (Meteor.isServer) {
    throw new Error('TTS Engine is client-only')
  }

  TTSConfig.urlLoader(loader)
  TTSEngine.setMode(mode)

  if (mode === TTSEngine.modes.browser) {
    BrowserTTS.load({
      onError (err) {
        log(err)
        TTSEngine.mode = TTSEngine.modes.server
        isConfigured = true
      },
      onComplete () {
        log('successfully loaded')
        isConfigured = true
      }
    })
  } else {
    isConfigured = true
  }
}

TTSEngine.setMode = function setMode (mode) {
  log('set mode to', mode)
  TTSEngine.mode = mode
}

TTSEngine.play = function play ({ id, text, onEnd, onError }) {
  if (!isConfigured) {
    throw new Error('TTS needs to be configured, first!')
  }

  const fallback = () => {
    BrowserTTS.play({ id, text, onEnd, onError })
    TTSEngine.mode = TTSEngine.modes.browser
  }
  if (TTSEngine.mode === TTSEngine.modes.server) {
    const onErrorInternal = err => {
      log('failed with an error. Attempt fallback. Error details:', err)
      fallback()
    }
    ServerTTS.play({ id, text, onEnd, onError: onErrorInternal })
  } else {
    fallback()
  }
}

TTSEngine.stop = function stop () {
  if (!isConfigured) {
    throw new Error('TTS needs to be configured, first!')
  }

  if (TTSEngine.mode === TTSEngine.modes.server) {
    ServerTTS.stop()
  } else {
    BrowserTTS.stop()
  }
}
