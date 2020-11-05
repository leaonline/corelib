import { Labels } from '../../i18n/Labels'
import { Scoring } from '../../scoring/Scoring'
import { Competency } from '../../contexts/Competency'

export const Cloze = {}

Cloze.name = 'cloze'
Cloze.label = 'item.cloze.title'
Cloze.icon = 'align-left'
Cloze.isItem = true

Cloze.flavor = {
  select: {
    name: 'select',
    value: 1,
    label: 'item.cloze.select'
  },
  blanks: {
    name: 'blanks',
    value: 2,
    label: 'item.cloze.blanks'
  }
}

Cloze.schema = {
  flavor: {
    type: Number,
    label: 'item.flavor',
    min: 1,
    max: 3,
    defaultValue: 1,
    options: Object.values(Cloze.flavor)
  },
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
    type: Number
  },
  'scoring.$.correctResponse': {
    type: RegExp,
    label: Labels.entry
  }
}
