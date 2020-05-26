import { MediaLib } from '../MediaLib'
import { Labels } from '../../common/Labels'

export const SingleChoice = {}

SingleChoice.name = 'singleChoice'
SingleChoice.label = 'singleChoice.title'
SingleChoice.icon = 'list-ul'
SingleChoice.isItem = true

SingleChoice.schema =  {
  choices: {
    type: Array,
    label: 'item.choices'
  },
  'choices.$': Object,
  'choices.$.text': {
    type: String,
    label: Labels.text
  },
  'choices.$.tts': {
    type: String,
    optional: true
  },
  'choices.$.image': {
    type: String,
    optional: true,
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  correctResponse: {
    type: Number
  }
}
