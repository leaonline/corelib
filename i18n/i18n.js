import { check } from 'meteor/check'

export const i18n = {}

const defaultTranslator = {
  get: label => label,
  set: () => {},
  getLocale: () => ''
}

let _translator = defaultTranslator
let _localeOpts

async function autoLoadLocale (lang) {
  switch (lang) {
    case 'de': {
      const opts = await import('./de/i18n_de_localeoptions')
      const lang = await import('./de/i18n_de')
      return { lang: lang.default, opts: opts.default }
    }
    default: {
      const opts = await import('./de/i18n_de_localeoptions')
      const lang = await import('./de/i18n_de')
      return { lang: lang.default, opts: opts.default }
    }
  }
}

/**
 * Inject your i18n provider, that implementes the interface, defined by the params of this method.
 * If your i18n framework does not implement them, you can create a wrapper around them.
 * @param get {Function} A function that takes a label String + options (optional) and returns the translated String
 * @param set {Function} A function that sets / extends translation for a given language by schema: { [langCode]: Object }
 * @param getLocale {Function} Returns the current locale
 */

i18n.load = async function load ({ get, set, getLocale, thisContext }) {
  check(get, Function)
  check(set, Function)
  check(getLocale, Function)

  _translator = {
    get: get.bind(thisContext),
    set: set.bind(thisContext),
    getLocale: getLocale.bind(thisContext)
  }

  const locale = _translator.getLocale()
  const { lang, opts } = await autoLoadLocale(locale)

  _translator.set(locale, lang)
  _localeOpts = opts

  return this
}

i18n.get = function get (...params) {
  return _translator.get(...params)
}

i18n.reactive = function reactive (...params) {
  return () => _translator.get(...params)
}

i18n.set = function set (lang, options) {
  return _translator.set(lang, options)
}

i18n.getLocale = function getLocale () {
  return _translator.getLocale()
}

i18n.clear = function clear () {
  _translator = defaultTranslator
}

i18n.localeDateOptions = function () {
  return _localeOpts
}
