import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { dataTarget } from '../../utils/eventUtils'
import { TTSEngine } from '../../tts/TTSEngine'
import './text.css'
import './text.html'

const OUT_TIMEOUT = 100
const whiteSpace = /\s+/g

Template.text.onCreated(function () {
  const instance = this
  instance.startIndex = new ReactiveVar(-1)
  const _isPlaying = new ReactiveVar({})

  instance.play = (...indices) => {
    const isPlaying = _isPlaying.get()
    indices.forEach(index => {
      isPlaying[index] = true
    })
    _isPlaying.set(isPlaying)
  }
  instance.stop = index => {
    const isPlaying = _isPlaying.get()
    isPlaying[index] = false
    _isPlaying.set(isPlaying)
  }
  instance.clear = () => {
    _isPlaying.set({})
  }
  instance.isPlaying = index => _isPlaying.get()[index]
})

Template.text.helpers({
  tokens () {
    return Template.instance().data.src.split(whiteSpace)
  },
  tokenAttributes (currentIndex) {
    const instance = Template.instance()
    const { data } = instance
    const customTokenClass = data.tokenClass || ''
    const playingClass = instance.isPlaying(currentIndex)
      ? 'lea-text-token-active'
      : ''
    return { class: `lea-text-token ${playingClass} ${customTokenClass}` }
  }
})

Template.text.events({
  'click .lea-text-token' (event, templateInstance) {
    event.preventDefault()
    templateInstance.clear()

    const index = dataTarget(event, templateInstance, 'index')
    const text = templateInstance.$(event.currentTarget).text()
    const onEnd = () => templateInstance.stop(index)

    TTSEngine.play({ text, onEnd })
    templateInstance.play(index)
  }
  /*
  'mousedown .lea-text-token' (event, templateInstance) {
    const index = dataTarget(event, templateInstance, 'index')
    templateInstance.startIndex.set(index)
  },
  'mouseup .lea-text-token' (event, templateInstance) {
    const selection = window.getSelection
      ? window.getSelection()
      : document.selection
    const selectedText = selection.toString()
    if (!selectedText) {
      return true
    }

    const token = templateInstance.token.get()
    const endIndex = dataTarget(event, templateInstance, 'index') || token.length - 1
    const startIndex = templateInstance.startIndex.get() || 0
    const length = endIndex - startIndex
    const indices = []
    indices.length = length

    let i
    for (i = 0; i <= length; i++) {
      indices[ i ] = startIndex + i
    }

    // get the "real" tokens from the
    // spans, referred by the indices
    const onEnd = () => templateInstance.clear()
    const text = indices.map(index => token[ index ]).join(' ')

    // also clear on ranges the
    // existing isPlaying state
    templateInstance.clear()

    TTSEngine.play({ text, onEnd })
    templateInstance.play(...indices)

    // cleanup selection
    if (selection.removeAllRanges) {
      selection.removeAllRanges()
    } else if (selection.empty) {
      selection.empty()
    }
  }
  */
})
