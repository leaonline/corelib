import { check } from 'meteor/check'
import { BrowserTTS } from './BrowserTTS'
import { ServerTTS } from './ServerTTS'
import { TTSConfig } from './TTSConfig'

export const TTSEngine = {}

TTSEngine.configure = function ({ ttsUrl }) {
  check(ttsUrl, String)

  // on macos and ios we
  const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)
  const isIOS = /(iPhone|iPod|iPad)/i.test(window.navigator.platform)
  TTSEngine.mode = (isMacLike || isIOS) ? 'browser' : 'server'

  TTSConfig.url(ttsUrl)
  BrowserTTS.load()
}

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
