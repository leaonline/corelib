import { Dimension } from './Dimension'
import { Labels } from '../i18n/Labels'
import { Status } from '../types/Status'
import { CompetencyCategory } from './CompetencyCategory'

export const Competency = {
  name: 'competency',
  label: 'competency.title',
  icon: 'star',
  representative: 'shortCode'
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
  dimension: {
    type: String,
    label: Dimension.label,
    dependency: {
      collection: Dimension.name,
      field: Dimension.representative
    }
  },
  category: {
    type: String,
    label: CompetencyCategory.label,
    dependency: {
      collection: CompetencyCategory.name,
      field: CompetencyCategory.representative,
      filter: {
        byField: Dimension.name
      }
    }
  },
  level: {
    type: Number,
    min: 1,
    max: Number.MAX_SAFE_INTEGER
  },
  [Competency.representative]: {
    type: String,
    max: 25
  },
  description: {
    type: String,
    label: Labels.description,
    max: 2500
  },
  descriptionSimple: {
    type: String,
    max: 2500,
    optional: true
  },
  example: {
    type: String,
    max: 2500,
    optional: true
  },
  shortCode_legacy: {
    type: String,
    optional: true,
    list: false,
    max: 10,
    group: Labels.legacy
  },
  description_legacy: {
    type: String,
    optional: true,
    list: false,
    max: 2500,
    group: Labels.legacy
  },
  descriptionSimple_legacy: {
    type: String,
    optional: true,
    list: false,
    max: 2500,
    group: Labels.legacy
  }
}

Competency.helpers = {}
Competency.methods = {}
Competency.publications = {}
