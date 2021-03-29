/* eslint-env mocha */
import { Random } from 'meteor/random'
import { expect } from 'chai'
import { i18n } from '../i18n'
import { delay, iterate } from '../../test-helpers.tests'

const getTranslator = prefix => {
  let _prefix = prefix
  return {
    get: function (...args) {
      const out = args.reduce((a, b) => a + b)
      return `${_prefix}.${out}`
    },
    set: function (...args) {
      if (!args.every(o => typeof o === 'string')) {
        return
      }
      const out = args.reduce((a, b) => a + b)
      _prefix = out
    },
    getLocale: function () {
      return 'de'
    }
  }
}

describe('i18n', function () {
  afterEach(function () {
    i18n.clear()
  })

  describe(i18n.load.name, function () {
    it('injects the i18n provider', function (done) {
      const id = Random.id()
      const translator = getTranslator(id)
      i18n.load({
        get: translator.get,
        set: translator.set,
        getLocale: translator.getLocale,
        thisContext: translator
      })
        .then(() => {
          done()
        })
        .catch(e => done(e))
    })
    it('passes errors to the promise catch', function (done) {
      const id = Random.id()
      const errId = Random.id()
      const translator = getTranslator(id)
      i18n.load({
        get: translator.get,
        set: translator.set,
        getLocale () {
          throw new Error(errId)
        },
        thisContext: translator
      })
        .then(() => {
          done(new Error('expect error, got none'))
        })
        .catch(e => {
          expect(e.message).to.equal(errId)
          done()
        })
    })
  })

  describe(i18n.get.name, function () {
    it('returns the value itself per default', function () {
      const id = Random.id()
      expect(i18n.get(id)).to.equal(id)
    })
    it('passes the params to the provider', async function () {
      const prefix = Random.id()
      const suffix = Random.id()
      const translator = getTranslator(prefix)
      await i18n.load({
        get: translator.get,
        set: translator.set,
        getLocale: translator.getLocale,
        thisContext: translator
      })

      expect(i18n.get(suffix)).to.equal(`${prefix}.${suffix}`)
    })
  })
  describe(i18n.set.name, function () {
    it('passes the params to the provider', async function () {
      const prefix = Random.id()
      const suffix = Random.id()
      const translator = getTranslator(prefix)
      await i18n.load({
        get: translator.get,
        set: translator.set,
        getLocale: translator.getLocale,
        thisContext: translator
      })

      await delay(10)
      i18n.set('foo', 'bar')
      expect(i18n.get(suffix)).to.equal(`foobar.${suffix}`)
    })
  })
  describe(i18n.reactive.name, function () {
    it('returns a function that resolves to the getter', async function () {
      const prefix = Random.id()
      const suffix = Random.id()
      const translator = getTranslator(prefix)
      await i18n.load({
        get: translator.get,
        set: translator.set,
        getLocale: translator.getLocale,
        thisContext: translator
      })

      const getter = i18n.reactive(suffix)
      const times = Math.floor(Math.random() * 50)
      iterate(times, function () {
        expect(getter()).to.equal(`${prefix}.${suffix}`)
      })
    })
  })
  describe(i18n.getLocale.name, function () {
    it('returns the result from the provider', async function () {
      const prefix = Random.id()
      const translator = getTranslator(prefix)
      await i18n.load({
        get: translator.get,
        set: translator.set,
        getLocale: translator.getLocale,
        thisContext: translator
      })

      expect(i18n.getLocale()).to.equal('de')
    })
  })
})
