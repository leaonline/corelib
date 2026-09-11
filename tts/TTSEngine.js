import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'
import { ReactiveDict } from 'meteor/reactive-dict'
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

const isConfigured = new ReactiveDict({})
let _globalErrorHandler = (err) => console.error('[TTSEngine]: error ', err.message, err.details)

const ensureConfig = () => {
  if (!isConfigured.get(TTSEngine.mode)) {
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
            console.debug(err)
            if (onError) {
                onError(err)
            } else {
                _globalErrorHandler(err)
            }
        },
        onComplete (data) {
            log(`successfully loaded mode ${mode}`)
            isConfigured.set(mode, true)
            if (onComplete) {
                return onComplete(data)
            }
        }
    })
}

TTSEngine.setMode = function setMode (mode) {
  log('set mode to', mode)
  ensureConfig()
  TTSEngine.mode = mode
}

TTSEngine.isConfigured = () => isConfigured.get(TTSEngine.mode)

TTSEngine.replay = () => {
    TTSEngine.stop()
    TTSEngine.play(playCache)
}

let playCache = {}

TTSEngine.play = function play ({ id, text, volume, rate, pitch, onEnd, onError }) {
  ensureConfig()
  const errHandler = onError || _globalErrorHandler
  const endHandler = onEnd || (() => {})
    playCache = {
        id,
        text,
        volume,
        rate,
        pitch,
        onEnd: endHandler,
        onError: errHandler
    }
  return getImpl().play(playCache)
}

TTSEngine.stop = function stop ({ onError } = {}) {
  ensureConfig()
  return getImpl().stop({ onError })
}

TTSEngine.defaults = ({ volume, rate, pitch }) => getImpl().defaults({ volume, rate, pitch })
