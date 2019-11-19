import { ReactiveVar } from 'meteor/reactive-var'
import { createSimpleTokenizer } from '../../../utils/tokenizer'
import '../../../components/soundbutton/soundbutton'
import './clozeItemRenderer.html'

const separator = '$'
const startPattern = '{{'
const closePattern = '}}'
const tokenize = createSimpleTokenizer(startPattern, closePattern)

Template.clozeItemRenderer.onCreated(function () {
  const instance = this
  instance.tokens = new ReactiveVar()

  instance.autorun(() => {
    const data = Template.currentData()
    const { value } = data
    const tokens = tokenize(value).map(entry => {
      if (entry.value.indexOf(separator) === -1) {
        return entry
      }
      const split = entry.value.split('$')
      entry.value = split[ 0 ]
      entry.tts = split[ 1 ]
      return entry
    })
    instance.tokens.set(tokens)

  })
})

Template.clozeItemRenderer.helpers({
  tokens () {
    return Template.instance().tokens.get()
  }
})

Template.clozeItemRenderer.events({
  'input .cloze-input' (event, templateInstance) {
    const $target = templateInstance.$(event.currentTarget)
    const $container = templateInstance.$('.cloze-container')

    // prevent layout overflow by limiting
    // overall width of an input to it's parent
    if ($target.width() >= $container.width()) {
      return
    }

    // otherwise we resize, if the word length
    // exceedes the default size of the input words
    const value = $target.val()
    const tokenindex = $target.data('tokenindex')
    const tokens = templateInstance.tokens.get()
    const originalSize = tokens[ tokenindex ].value.length
    const newSize = value.length > originalSize ? value.length : originalSize
    $target.attr('size', newSize)
  }
})