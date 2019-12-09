import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { dataTarget } from '../../utils/eventUtils'
import { TTSEngine } from '../../tts/TTSEngine'
import './text.css'
import './text.html'

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
  attributes() {
    const data = Template.instance().data
    const additionalClass = data.class || ''
    return  {
      class: `lea-text text-wrapper ${additionalClass}`
    }
  },
  tokens () {
    return Template.instance().data.src.split(whiteSpace)
  },
  tokenAttributes (currentIndex) {
    const instance = Template.instance()
    const { data } = instance
    const fill = (data.fill && 'flex-fill') || ''
    const customTokenClass = data.tokenClass || ''
    const playingClass = instance.isPlaying(currentIndex)
      ? 'lea-text-token-active'
      : ''
    return { class: `lea-text-token ${fill} ${playingClass} ${customTokenClass}` }
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
})
