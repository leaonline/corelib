import { MediaLib } from '../../contexts/MediaLib'
import { Labels } from '../../i18n/Labels'
import { Competency } from '../../contexts/Competency'

export const Choice = {}

Choice.name = 'choice'
Choice.label = 'choice.title'
Choice.icon = 'list-ul'
Choice.isItem = true

Choice.flavors = {
  single: {
    name: 'single',
    value: 1,
    label: 'item.choice.single'
  },
  multiple: {
    name: 'multiple',
    value: 2,
    label: 'item.choice.multiple'
  }
}

Choice.scoringTypes = {
  all: {
    name: 'all',
    value: 1,
    label: 'scoring.requires.all'
  },
  any: {
    name: 'any',
    value: 2,
    label: 'scoring.requires.any'
  }
}

Choice.schema = {
  flavor: {
    type: Number,
    label: 'item.flavor',
    allowedValues: [1, 2],
    options: [
      Choice.flavors.single,
      Choice.flavors.multiple
    ],
    defaultValue: 1
  },
  shuffle: {
    type: Boolean,
    label: 'item.shuffle',
    defaultValue: false
  },
  choices: {
    type: Array,
    label: 'item.choices',
    min: 2
  },
  'choices.$': {
    type: Object,
    label: Labels.entry
  },
  'choices.$.text': {
    type: String,
    label: Labels.text
  },
  'choices.$.tts': {
    type: String,
    optional: true,
    label: 'tts.text'
  },
  'choices.$.image': {
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
      Choice.scoringTypes.all,
      Choice.scoringTypes.any
    ],
    defaultValue: 1
  },
  'scoring.$.correctResponse': {
    type: Array,
    label: 'scoring.correctResponse',
  },
  'scoring.$.correctResponse.$': {
    type: Number,
    label: Labels.entry,
    dependency: {
      context: null, // self
      requires: 'choices',
      field: 'choices',
      valueField: '@index',
      labelField: 'text'
    }
  }
}
