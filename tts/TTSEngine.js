import { check } from 'meteor/check'
import { BrowserTTS } from './BrowserTTS'
import { ServerTTS } from './ServerTTS'
import { TTSConfig } from './TTSConfig'

export const TTSEngine = {}

TTSEngine.configure = function ({ ttsUrl }) {
  check(ttsUrl, String)
  TTSConfig.url({ttsUrl})
  BrowserTTS.load()
}

TTSEngine.mode = 'server'

TTSEngine.play = function ({ id, text, onEnd }) {
  const fallback = () => {
    BrowserTTS.play({ id, text, onEnd })
    TTSEngine.mode = 'browser'
  }
  if (TTSEngine.mode === 'server') {
    const onError = err => {
      console.warn('[TTSEngine]: failed with an error. Attempt fallback. Error details:', err)
      fallback()
    }
    ServerTTS.play({ id, text, onEnd, onError })
  } else {
    fallback()
  }
}

TTSEngine.stop = function () {
  if (TTSEngine.mode === 'server') {
    ServerTTS.stop()
  } else {
    BrowserTTS.stop()
  }
}
