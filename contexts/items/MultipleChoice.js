export const MultipleChoice = {}

MultipleChoice.name = 'multipleChoice'
MultipleChoice.label = 'multipleChoice.label'
MultipleChoice.icon = 'checkbox'
MultipleChoice.isInteraction = true

MultipleChoice.schema = () => ({
  isMultiple: Boolean,
  showAbc: Boolean,
  shuffle: Boolean,
  choices: Array,
  'choices.$': Object,
  'choices.$.text': {
    type: String,
    optional: true
  },
  'choices.$.tts': {
    type: String,
    optional: true
  },
  'choices.$.image': {
    type: String,
    optional: true
  },
  rules: Array,
  'rules.$': String
})