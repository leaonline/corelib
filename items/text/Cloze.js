import { Labels } from '../../i18n/Labels'

export const Cloze = {}

Cloze.name = 'cloze'
Cloze.label = 'cloze.title'
Cloze.icon = 'align-left'
Cloze.isItem = true

Cloze.flavor = {
  select: {
    name: 'select',
    value: 1,
    label: 'item.cloze.flavor.select'
  },
  highlight: {
    name: 'highlight',
    value: 2,
    label: 'item.cloze.flavor.highlight'
  },
  blanks: {
    name: 'blanks',
    value: 3,
    label: 'item.cloze.flavor.blanks'
  },
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
  inputs: {
    type: Array
  },
  'inputs.$': {
    type: Object
  },
  'inputs.$.expectedText': {
    type: String
  },
  'inputs.$.prefix': {
    type: String,
    optional: true
  },
  'inputs.$.suffix': {
    type: String,
    optional: true
  },
  'inputs.$.tts': {
    type: String,
    optional: true
  },
  'inputs.$.correctResponse': {
    type: String
  }
}
