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
  instance.responseCache = new ReactiveVar('')

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
