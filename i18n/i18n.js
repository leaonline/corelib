import { check } from 'meteor/check'

let _translator

export const i18n = {}

i18n.load = function ({ get, set, getLocale }) {
  check(get, Function)
  check(set, Function)
  check(getLocale, Function)
  _translator = i18n
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
