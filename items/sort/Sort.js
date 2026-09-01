import { MediaLib } from '../../contexts/MediaLib'
import { Labels } from '../../i18n/Labels'
import { Competency } from '../../contexts/Competency'
import { Scoring } from '../../scoring/Scoring'

export const Sort = {}

Sort.name = 'sort'
Sort.label = 'item.sort.title'
Sort.icon = 'list-ol'
Sort.isItem = true

Sort.schema = {
  list: {
    type: Array,
    label: 'item.sort.list'
  },
  'list.$': {
    type: Object,
    label: Labels.entry
  },
  'list.$.text': {
    type: String,
    label: Labels.text,
    optional: true
  },
  'list.$.tts': {
    type: String,
    optional: true,
    label: 'tts.text'
  },
  'list.$.image': {
    type: String,
    optional: true,
    label: 'image.title',
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original',
      isImage: true
    }
  },

  scoring: {
    type: Array,
    label: 'scoring.title'
    // optional: true // todo remove after trial phase
  },
  'scoring.$': {
    type: Object,
    label: Labels.entry
  },
  'scoring.$.competency': {
    type: String,
    label: Competency.label,
    dependency: {
      collection: Competency.name,
      field: Competency.representative
    }
  },
  'scoring.$.requires': {
    type: Number,
    label: 'scoring.requires.title',
    allowedValues: [1, 2],
    options: [
      Scoring.types.all,
      Scoring.types.any
    ],
    defaultValue: 1
  },
  'scoring.$.correctResponse': {
    type: Array,
    label: 'scoring.correctResponse'
  },
  'scoring.$.correctResponse.$': {
    type: Number,
    label: Labels.entry,
    dependency: {
      context: null, // self
      requires: 'list',
      field: 'list',
      valueField: '@index',
      labelField: 'text'
    }
  },
  'scoring.$.explanation': {
    type: String,
    optional: true,
    label: 'scoring.explanation'
  },
  explanation: {
    type: String,
    optional: true,
    label: 'item.explanation'
  }
}
