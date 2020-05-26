import { Meteor } from 'meteor/meteor'
import { ReactiveVar } from 'meteor/reactive-var'

export const Components = {}

Components.debug = false

const log = (...args) => {
  if (Meteor.isDevelopment && Components.debug) {
    console.log(...args)
  }
}

const loaded = {}
const internal = {}

internal.soundbutton = {
  template: 'soundbutton',
  async load () {
    return import('./soundbutton/soundbutton')
  }
}

internal.actionButton = {
  template: 'actionButton',
  async load () {
    return import('./actionButton/actionButton')
  }
}

internal.text = {
  template: 'text',
  async load () {
    return import('./text/text')
  }
}

internal.textGroup = {
  template: 'textGroup',
  async load () {
    return import('./textgroup/textgroup')
  }
}

internal.image = {
  template: 'image',
  async load () {
    return import('./image/image')
  }
}

internal.icon = {
  template: 'icon',
  async load () {
    return import('./icon/icon')
  }
}

Components.template = {
  soundbutton: internal.soundbutton.template,
  actionButton: internal.actionButton.template,
  text: internal.text.template,
  textGroup: internal.textGroup.template,
  image: internal.image.template,
  icon: internal.icon.template
}

async function _load (name) {
  log(`[Components]: try to load <${name}>`)
  if (!internal[name]) return false
  if (loaded[name]) {
    log(`[Components]: already loaded <${name}>`)
    return true
  } else {
    log(`[Components]: load <${name}>`)
    loaded[name] = true
  }
  return internal[name].load()
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
    .catch(e => {
      console.error('Error while loaing', names)
      console.error(e)
    })
  return loaded
}
