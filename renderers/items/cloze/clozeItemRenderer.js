import { ReactiveVar } from 'meteor/reactive-var'
import { createSimpleTokenizer } from '../../../utils/tokenizer'
import '../../../components/soundbutton/soundbutton'
import './clozeItemRenderer.html'
import './clozeItemRenderer.css'

const separator = '$'
const startPattern = '{{'
const closePattern = '}}'
const newLinePattern = '//'
const newLineReplacer = `${startPattern}${newLinePattern}${closePattern}`
const newLineRegExp = new RegExp(/\n/,'g')
const tokenize = createSimpleTokenizer(startPattern, closePattern)

Template.clozeItemRenderer.onCreated(function () {
  const instance = this
  instance.tokens = new ReactiveVar()
  instance.color = new ReactiveVar('secondary')
  instance.responseCache = new ReactiveVar('')

  instance.autorun(() => {
    const data = Template.currentData()

    // set the color of the current dimension
    // only if it has been passed with the data
    const { color } = data
    if (color) {
      instance.color.set(color)
    }

    const { value } = data
    const preprocessedValue = value.replace(newLineRegExp, newLineReplacer)

    console.log(value)
    console.log(preprocessedValue)
    const tokens = tokenize(preprocessedValue).map(entry => {
      // we simply indicate newlines within
      // our brackets to avoid complex parsing
      if (entry.value.indexOf('//') > -1) {
        entry.isNewLine = true
        return entry
      }

      // for normal text tokens we don't need
      // further processing of content here
      if (entry.value.indexOf(separator) === -1) {
        return entry
      }
      const split = entry.value.split('$')
      console.log(split)
      entry.value = split[ 0 ]
      entry.label = split[ 1 ]
      entry.tts = split[ 2 ]
      entry.length = entry.value.length
      return entry
    })
    console.log(tokens)
    instance.tokens.set(tokens)
  })
})

Template.clozeItemRenderer.helpers({
  tokens () {
    return Template.instance().tokens.get()
  },
  color () {
    return Template.instance().color.get()
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
  },
  'blur .cloze-input' (event, templateInstance) {
    submitValues(templateInstance)
  }
})

function submitValues (templateInstance) {
  // skip if there is no onInput connected
  // which can happen when creating new items
  if (!templateInstance.data.onInput) {
    return
  }

  const userId = templateInstance.data.userId
  const sessionId = templateInstance.data.sessionId
  const taskId = templateInstance.data.taskId
  const page = templateInstance.data.page
  const type = templateInstance.data.subtype

  // also return if our identifier values
  // are not set, which also can occur in item-dev
  if (!userId || !sessionId || !taskId) {
    return
  }

  const responses = []
  templateInstance.$('input').each(function (index, input) {
    const value = templateInstance.$(input).val()
    responses.push(value || '__undefined__')
  })

  // we use a simple stringified cache as we have fixed
  // positions, so we can easily skip sending same repsonses
  const cache = templateInstance.responseCache.get()
  const strResponses = JSON.stringify(responses)
  if (strResponses === cache) {
    return
  }

  templateInstance.responseCache.set(strResponses)
  templateInstance.data.onInput({ userId, sessionId, taskId, page, type, responses })
}
