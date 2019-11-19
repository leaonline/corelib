import { ReactiveVar } from 'meteor/reactive-var'
import {createSimpleTokenizer} from '../../../utils/tokenizer'
import './clozeItemRenderer.html'

const startPattern = '{{'
const closePattern = '}}'
const tokenize = createSimpleTokenizer(startPattern, closePattern)

Template.clozeItemRenderer.onCreated(function () {
  const instance = this
  instance.tokens = new ReactiveVar()

  instance.autorun(() => {
    const data = Template.currentData()
    const { value } = data
    const tokens = tokenize(value)
    instance.tokens.set(tokens)

  })
})

Template.clozeItemRenderer.helpers({
  tokens () {
    return Template.instance().tokens.get()
  }
})