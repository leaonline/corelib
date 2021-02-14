import { Labels } from '../../i18n/Labels'
import { Competency } from '../../contexts/Competency'

export const Cloze = {}

Cloze.name = 'cloze'
Cloze.label = 'item.cloze.title'
Cloze.icon = 'align-left'
Cloze.MAX_LENGTH = 10000
Cloze.isItem = true

Cloze.flavor = {
  select: {
    name: 'select',
    value: 1
  },
  blanks: {
    name: 'blanks',
    value: 2
  }
}

Cloze.schema = {
  text: {
    type: String,
    label: Labels.text,
    max: 10000
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
  'scoring.$.target': {
    type: Number,
    min: 0,
    options: {
      // for this we need a list of text token from the original
      method: 'tokenize',
      input: {
        type: 'self',
        source: 'text',
        pattern: /{{\w*\$([\w\d\[\]|])*\$\w*}}/g
      }
    }
  },
  'scoring.$.correctResponse': {
    type: RegExp,
    label: Labels.entry
  }
}
