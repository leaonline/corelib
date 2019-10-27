let _translator

export const i18n = {}

i18n.load = function (i18n) {
  _translator = i18n
}

i18n.get = function (...params) {
  return _translator.get(...params)
}

i18n.set = function (lang, options) {
  return _translator.addl10n({ [lang]: options })
}

i18n.getLocale = function () {
  return _translator.currentLocale.get()
}
