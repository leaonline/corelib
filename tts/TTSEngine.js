import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
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
let globalErrorHandler = (err, details) => console.error(err, details)

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

TTSEngine.isAvailable = function () {
  return TTSEngine.mode === TTSEngine.modes.browser
    ? BrowserTTS.isAvailable()
    : ServerTTS.isAvailable()
}

TTSEngine.configure = function configure ({ loader, mode = (TTSEngine.mode || TTSEngine.modes.browser), onComplete, onError }) {
  check(loader, Function)
  check(mode, String)
  check(onError, Match.Maybe(Function))

  if (Meteor.isServer) {
    throw new Error('TTSEngine is currently a client-only implementation!')
  }

  TTSConfig.urlLoader(loader)
  TTSEngine.setMode(mode)

  if (onError) {
    globalErrorHandler = onError
  }

  if (mode === TTSEngine.modes.browser) {
    BrowserTTS.load({
      onError (err) {
        log(err)
        globalErrorHandler(err)
        TTSEngine.mode = TTSEngine.modes.server
        isConfigured = true
      },
      onComplete () {
        log('successfully loaded')
        isConfigured = true
        if (onComplete) onComplete()
      }
    })
  } else {
    isConfigured = true
    if (onComplete) onComplete()
  }
}

TTSEngine.setMode = function setMode (mode) {
  log('set mode to', mode)
  TTSEngine.mode = mode
}

TTSEngine.isConfigured = () => isConfigured

TTSEngine.play = function play ({ id, text, volume, onEnd, onError }) {
  if (!isConfigured) {
    throw new Error('TTS needs to be configured, first!')
  }

  const fallback = () => {
    const onBrowserError = err => {
      globalErrorHandler(err)
      if (onError) onError(err)
    }

    try {
      BrowserTTS.play({ id, text, volume, onEnd, onError: onBrowserError })
    } catch (playbackError) {
      onBrowserError(playbackError)
    }
    TTSEngine.mode = TTSEngine.modes.browser
  }
  if (TTSEngine.mode === TTSEngine.modes.server) {
    const onErrorInternal = err => {
      log('failed with an error. Attempt fallback. Error details:', err)
      globalErrorHandler(err)
      fallback()
    }
    ServerTTS.play({ id, text, volume, onEnd, onError: onErrorInternal })
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
