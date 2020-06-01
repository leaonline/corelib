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

/**
 * Inject your i18n provider, that implementes the interface, defined by the params of this method.
 * If your i18n framework does not implement them, you can create a wrapper around them.
 * @param get A function that takes a label String + options (optional) and returns the translated String
 * @param set A function that sets / extends translation for a given language by schema: { [langCode]: Object }
 * @param getLocale Returns the current locale
 */

i18n.load = function ({ get, set, getLocale, thisContext }) {
  check(get, Function)
  check(set, Function)
  check(getLocale, Function)
  _translator = {
    get: get.bind(thisContext),
    set: set.bind(thisContext),
    getLocale: getLocale.bind(thisContext)
  }
  const locale = _translator.getLocale()
  autoLoadLocale(locale)
    .then(module => {
      _translator.set(locale, module.default)
    })
    .catch(e => {
      console.error('Error loading locale!', locale)
      console.error(e)
    })
}

i18n.get = function (...params) {
  return _translator.get(...params)
}

i18n.reactive = function (...params) {
  return () => _translator.get(...params)
}

i18n.set = function (lang, options) {
  return _translator.set(lang, options)
}

i18n.getLocale = function () {
  return _translator.getLocale()
}
