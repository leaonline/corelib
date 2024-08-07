import { Status } from '../types/Status'
import { Labels } from '../i18n/Labels'

/**
 * Represents a field of work.
 * Do not confuse with the technical concept of database fields.
 */
export const Field = {}

Field.name = 'field'
Field.label = 'field.title'
Field.icon = 'wrench'
Field.representative = 'title'
Field.useHistory = true

Field.schema = {
  status: {
    type: Number,
    label: Status.label,
    allowedValues: Status.allowedValues,
    defaultValue: Status.defaultValue,
    dependency: {
      context: Status.name,
      field: Status.representative
    }
  },
  [Field.representative]: {
    type: String,
    label: Labels[Field.representative]
  },
  shortCode: {
    label: Labels.shortCode,
    type: String,
    min: 2,
    max: 2,
    unique: true
  },
  isLegacy: {
    type: Boolean,
    label: Labels.legacy,
    optional: true
  },
  icon: {
    type: String,
    optional: true,
    label: Labels.icon
  },
  jobs: {
    type: Array,
    label: 'field.jobs',
    optional: true
  },
  'jobs.$': {
    type: String,
    label: Labels.entry,
    list: false
  }
}
