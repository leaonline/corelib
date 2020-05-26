import { ColorType } from '../types/ColorType'
import { Status } from '../types/Status'
import { Labels } from '../common/Labels'

export const Dimension = {}

Dimension.name = 'dimension'
Dimension.label = 'dimension.title'
Dimension.icon = 'th-large'
Dimension.representative = 'title'
Dimension.useHistory = true

Dimension.schema = {
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
  [Dimension.representative]: {
    type: String,
    label: Labels[Dimension.representative]
  },
  description: {
    type: String,
    label: Labels.description,
    optional: true
  },
  icon: {
    type: String,
    label: Labels.icon
  },
  colorType: {
    type: Number,
    label: ColorType.label,
    allowedValues: ColorType.allowedValues,
    dependency: {
      context: ColorType.name,
      field: ColorType.representative
    }
  },
  shortCode: {
    type: String,
    label: Labels.shortCode,
    min: 1,
    max: 1,
    unique: true
  },
  shortNum: {
    type: Number,
    label: Labels.shortNum,
    min: 1,
    unique: true
  }
}
