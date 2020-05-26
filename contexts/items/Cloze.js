export const Cloze = {}

Cloze.name = 'cloze'
Cloze.label = 'cloze.title'
Cloze.icon = 'align-left'
Cloze.isInteraction = true

Cloze.schema = () => ({
  text: String,
  inputs: Array,
  'inputs.$': Object,
  'inputs.$.expectedText': String,
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
  'inputs.$.rules': Array,
  'inputs.$.rules.$': String
})