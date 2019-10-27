import { TTSConfig } from '../tts/TTSConfig'

export const Components = {}

Components.load = async function ({ ttsUrl }) {
  TTSConfig.url(ttsUrl)
  await import('./soundbutton/soundbutton')
  await import('./actionButton/actionButton')
  await import('./text/text')
  await import('./textgroup/textgroup')
  return import('./image/image')
}
