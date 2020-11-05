import { Labels } from '../../i18n/Labels'
import { Competency } from '../../contexts/Competency'
import { Scoring } from '../../scoring/Scoring'

export const Highlight = {}

Highlight.name = 'highlight'
Highlight.label = 'item.highlight.title'
Highlight.icon = 'highlighter'
Highlight.isItem = true

Highlight.schema = {
  text: {
    type: String,
    label: Labels.text,
    max: 10000
  },
  tts: {
    type: Boolean,
    label: 'item.highlight.activateTTS',
    optional: true
  },
  scoring: {
    type: Array,
    label: Scoring.label
  },
  'scoring.$': {
    type: Object,
    label: Labels.entry,
    optional: true
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
    allowedValues: [1, 2, 3],
    options: [
      Scoring.types.all,
      Scoring.types.allInclusive,
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
    min: 0,
    options: {
      // for this we need a list of text token from the original
      method: 'tokenize',
      input: {
        type: 'self',
        source: 'text'
      }
    }
  }
}
