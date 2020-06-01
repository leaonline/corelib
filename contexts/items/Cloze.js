export const Cloze = {}

Cloze.name = 'cloze'
Cloze.label = 'cloze.title'
Cloze.icon = 'align-left'
Cloze.isItem = true

Cloze.schema = {
  text: {
    type: String
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
