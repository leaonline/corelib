import { check } from 'meteor/check'
let _translator

export const i18n = {}

async function autoLoadLocale (lang) {
  switch (lang) {
    case 'de':
      return import('./i18n_de')
    default:
      return import('./i18n_de')
  }
}

i18n.load = function ({ get, set, getLocale }) {
  check(get, Function)
  check(set, Function)
  check(getLocale, Function)
  _translator = { get, set, getLocale }
  const locale = getLocale()
  autoLoadLocale(locale)
    .then(json => {
      set(locale, json)
    })
    .catch(e => console.error(e))
}

i18n.get = function (...params) {
  return _translator.get(...params)
}

i18n.set = function (lang, options) {
  return _translator.set(lang, options)
}

i18n.getLocale = function () {
  return _translator.getLocale()
}
