export const TTSConfig = {}

let url

TTSConfig.url = function (value) {
  if (value) {
    url = value
  }
  return url
}
