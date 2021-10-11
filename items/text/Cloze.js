import { Labels } from '../../i18n/Labels'
import { Competency } from '../../contexts/Competency'

export const Cloze = {}

Cloze.name = 'cloze'
Cloze.label = 'item.cloze.title'
Cloze.icon = 'align-left'
Cloze.MAX_LENGTH = 10000
Cloze.isItem = true

Cloze.flavor = {
  /**
   * A simple select-box, single-choice style
   */
  select: {
    name: 'select',
    value: 1
  },
  /**
   * Default, text-input
   */
  blanks: {
    name: 'blanks',
    value: 2
  },
  /**
   * Text-input that is not linked to any scoring. use as distractor or
   * placeholder or supplemental element.
   */
  empty: {
    name: 'empty',
    value: 3
  }
}

Cloze.schema = {
  text: {
    type: String,
    label: Labels.text,
    max: 10000
  },
  isTable: {
    type: Boolean,
    label: 'item.cloze.isTable',
    optional: true
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
    type: Array,
    label: Competency.label,
    dependency: {
      collection: Competency.name,
      field: Competency.representative
    }
  },
  'scoring.$.competency.$': {
    type: String,
    label: Labels.entry
  },
  'scoring.$.target': {
    type: Number,
    label: 'item.cloze.target',
    min: 0,
    options: {
      // for this we need a list of text token from the original
      method: 'tokenize',
      input: {
        type: 'self',
        source: 'text',
        // eslint-disable-next-line no-useless-escape
        pattern: /\{\{(blanks|select)\$([\[\]\s,\.\?„“‚‘!:;≠"'%/()|<>=+\-*\p{L}\p{M}0-9])*\$([\[\]\s,\.\?„“‚‘!:;≠"'%/()|<>=+\-*\p{L}\p{M}\d])*[\$\w=&\d]*\}\}/gu
      }
    }
  },
  'scoring.$.correctResponse': {
    type: RegExp,
    label: Labels.entry
  }
}
