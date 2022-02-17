import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'
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

const modesImpl = {
  browser: BrowserTTS,
  server: ServerTTS
}

const getImpl = () => {
  ensureConfig()
  return modesImpl[TTSEngine.mode]
}

const log = createLog({
  name: TTSEngine.name,
  devOnly: true
})

const isConfigured = new ReactiveVar(false)
let _globalErrorHandler = (err) => console.error('[TTSEngine]: error ', err.message, err.details)

const ensureConfig = () => {
  if (!isConfigured.get()) {
    throw new Error('[TTSEngine]: TTS needs to be configured, first!')
  }
}

// /////////////////////////////////////////////////////////////////////////////
//
// PUBLIC
//
// /////////////////////////////////////////////////////////////////////////////

TTSEngine.setLocale = function (locale) {
  return getImpl().setLocale(locale)
}

TTSEngine.isAvailable = function () {
  return getImpl().isAvailable()
}

TTSEngine.configure = function configure ({ loader, mode = (TTSEngine.mode || TTSEngine.modes.browser), onComplete, onError, globalErrorHandler }) {
  check(loader, Function)
  check(mode, String)
  check(onComplete, Match.Maybe(Function))
  check(onError, Match.Maybe(Function))
  check(globalErrorHandler, Match.Maybe(Function))

  if (Meteor.isServer) {
    throw new Error('TTSEngine is currently a client-only implementation!')
  }

  TTSConfig.urlLoader(loader)
  TTSEngine.mode = mode

  if (globalErrorHandler) {
    _globalErrorHandler = globalErrorHandler
  }

  modesImpl[mode].load({
    onError (err) {
      if (onError) {
        onError(err)
      } else {
        _globalErrorHandler(err)
      }
    },
    onComplete (data) {
      log('successfully loaded')
      isConfigured.set(true)
      if (onComplete) onComplete(data)
    }
  })
}

TTSEngine.setMode = function setMode (mode) {
  log('set mode to', mode)
  ensureConfig()
  TTSEngine.mode = mode
}

TTSEngine.isConfigured = () => isConfigured.get()

TTSEngine.play = function play ({ id, text, volume, onEnd, onError }) {
  ensureConfig()
  const errHandler = onError || _globalErrorHandler
  const endHandler = onEnd || (() => {})
  return getImpl().play({
    id,
    text,
    volume,
    onEnd: endHandler,
    onError: errHandler
  })
}

TTSEngine.stop = function stop ({ onError } = {}) {
  ensureConfig()
  return getImpl().stop({ onError })
}
