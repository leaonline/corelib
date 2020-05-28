import { MediaLib } from '../MediaLib'
import { Labels } from '../../i18n/Labels'
import { Competency } from '../Competency'

export const SingleChoice = {}

SingleChoice.name = 'singleChoice'
SingleChoice.label = 'singleChoice.title'
SingleChoice.icon = 'list-ul'
SingleChoice.isItem = true

SingleChoice.schema =  {
  choices: {
    type: Array,
    label: 'item.choices',
    min: 2
  },
  'choices.$': {
    type: Object,
    label: 'item.choice'
  },
  'choices.$.text': {
    type: String,
    label: Labels.text
  },
  'choices.$.tts': {
    type: String,
    optional: true,
    label: 'item.tts'
  },
  'choices.$.image': {
    type: String,
    optional: true,
    label: 'item.image',
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original',
      isImage: true
    }
  },
  shuffle: {
    type: Boolean,
    label: 'item.shuffle',
    defaultValue: false
  },
  scoring: {
    type: Array,
    // optional: true // todo remove after trial phase
  },
  'scoring.$': {
    type: Object
  },
  'scoring.$.competency': {
    type: String,
    label: Competency.label,
    dependency: {
      collection: Competency.name,
      field: Competency.representative
    }
  },
  'scoring.$.correctResponse': {
    type: Number,
    label: 'item.correctResponse',
    dependency: {
      context: null, // self
      requires: 'choices',
      field: 'choices',
      valueField: '@index',
      labelField: 'text'
    }
  }
}