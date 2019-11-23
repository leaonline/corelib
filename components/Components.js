import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'

export const Components = {}

Components.debug = false

const log = (...args) => {
  if (Meteor.isDevelopment && Components.debug) {
    console.log(...args)
  }
}

const _loaded = {}

const _comps = {}

_comps.soundbutton = {
  template: 'soundbutton',
  async load () {
    return import('./soundbutton/soundbutton')
  }
}

_comps.actionButton = {
  template: 'actionButton',
  async load () {
    return import('./actionButton/actionButton')
  }
}

_comps.text = {
  template: 'text',
  async load () {
    return import('./text/text')
  }
}

_comps.textGroup = {
  template: 'textGroup',
  async load () {
    return import('./textgroup/textgroup')
  }
}

_comps.image = {
  template: 'image',
  async load () {
    return import('./image/image')
  }
}

_comps.icon = {
  template: 'icon',
  async load () {
    return import('./icon/icon')
  }
}

Components.template = {
  soundbutton: _comps.soundbutton.template,
  actionButton: _comps.actionButton.template,
  text: _comps.text.template,
  textGroup: _comps.textGroup.template,
  image: _comps.image.template,
  icon: _comps.icon.template
}

async function _load (name) {
  log(`[Components]: try to load <${name}>`)
  if (!_comps[ name ]) return false
  if (_loaded[ name ]) {
    log(`[Components]: already loaded <${name}>`)
    return true
  } else {
    log(`[Components]: load <${name}>`)
    _loaded[ name ] = true
  }
  return _comps[ name ].load()
}

async function loadAll (names) {
  return Promise.all(names.map(name => _load(name)))
}

Components.load = function (names) {
  log('[Components]: loadall', names)
  const loaded = new ReactiveVar(false)
  loadAll(names)
    .then(() => {
      loaded.set(true)
    })
    .catch(e => console.error(e))
  return loaded
}
