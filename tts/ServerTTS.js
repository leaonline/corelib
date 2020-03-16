import { HTTP } from 'meteor/http'
import { i18n } from '../i18n/i18n'
import { TTSConfig } from './TTSConfig'

export const ServerTTS = {}

const _requestCache = new Map()

let audio

ServerTTS.play = function ({ id, text, onEnd, onError }) {
  const requestText = text || i18n.get(id)
  const cachedUrl = _requestCache.get(requestText)

  if (cachedUrl) {
    return playAudio(cachedUrl, onEnd)
  }

  const url = TTSConfig.url()
  const options = {
    params: { text: requestText },
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }

  HTTP.post(url, options, (err, res) => {
    if (err) {
      return onError(err)
    } else {
      const url = res.data && res.data.url
      if (!url) {
        return onError(new Error('Invalid response'))
      }
      _requestCache.set(requestText, url)
      playAudio(url, onEnd)
    }
  })
}

function playAudio (url, onEnd) {
  ServerTTS.stop()
  audio = new window.Audio(url)
  audio.onended = onEnd
  audio.play()
}

ServerTTS.stop = function () {
  if (audio) {
    audio.pause()
    const event = new window.Event('ended')
    audio.dispatchEvent(event)
  }
}
