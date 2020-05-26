import { Dimension } from './Dimension'
import { Labels } from '../common/Labels'
import { Status } from '../types/Status'

export const Competency = {
  name: 'competency',
  label: 'competency.title',
  icon: 'star',
  representative: 'shortCode',
  useHistory: true
}

Competency.schema = {
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
  [Competency.representative]: {
    type: String,
    label: Labels[Competency.representative],
    max: 25
  },
  dimension: {
    type: String,
    label: Dimension.label,
    dependency: {
      collection: Dimension.name,
      field: Dimension.representative
    }
  },
  description: {
    type: String,
    label: Labels.description,
    max: 2500
  },
  descriptionSimple: {
    type: String,
    max: 2500
  },
  shortCode_legacy: {
    type: String,
    optional: true,
    list: false,
    max: 10
  },
  description_legacy: {
    type: String,
    optional: true,
    list: false,
    max: 2500
  },
  descriptionSimple_legacy: {
    type: String,
    optional: true,
    list: false,
    max: 2500
  }
}

Competency.helpers = {}
Competency.methods = {}
Competency.publications = {}
