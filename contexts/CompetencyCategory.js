import { Dimension } from './Dimension'
import { Labels } from '../i18n/Labels'

export const CompetencyCategory = {
  name: 'competencyCategory',
  label: 'competencyCategory.title',
  icon: 'star',
  representative: 'title'
}

CompetencyCategory.schema = {
  dimension: {
    type: String,
    label: Dimension.label,
    dependency: {
      collection: Dimension.name,
      field: Dimension.representative
    }
  },
  [CompetencyCategory.representative]: {
    type: String,
    label: Labels.title
  }
}

CompetencyCategory.methods = {}
CompetencyCategory.publications = {}
CompetencyCategory.helpers = {}
