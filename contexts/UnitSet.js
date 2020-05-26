import { Field } from './Field'
import { Status } from '../types/Status'
import { Dimension } from '../contexts/Dimension'
import { Labels } from '../common/Labels'
import { getFieldName } from '../utils/getFieldName'

export const UnitSet = {}

UnitSet.name = 'unitSet'
UnitSet.label = 'unitSet.title'
UnitSet.icon = 'cubes'
UnitSet.representative = 'shortCode'
UnitSet.useHistory = true

UnitSet.schema = {
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
  [UnitSet.representative]: {
    type: String,
    label: Labels[UnitSet.representative],
    value: {
      method: 'concat',
      input: [
        {
          type: 'field',
          source: 'field',
          collection: Field.name,
          field: getFieldName(Field.schema, Field.schema.shortCode)
        },
        {
          type: 'value',
          value: '_'
        },
        {
          type: 'field',
          source: 'dimension',
          collection: Dimension.name,
          field: getFieldName(Dimension.schema, Dimension.schema.shortNum)
        },
        {
          type: 'increment',
          decimals: 3,
          collection: UnitSet.name
        }
      ]
    }
  },
  title: {
    type: String,
    optional: true,
    label: Labels.title
  },
  field: {
    type: String,
    label: Field.label,
    dependency: {
      collection: Field.name,
      field: Field.representative
    }
  },
  job: {
    type: Number,
    optional: true,
    dependency: {
      collection: Field.name,
      field: getFieldName(Field.schema, Field.schema.jobs),
      requires: 'field',
      isArray: true
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
  dimensionShort: {
    type: String,
    label: Dimension.label,
    value: {
      method: 'concat',
      input: [
        {
          type: 'field',
          source: 'dimension',
          collection: Dimension.name,
          field: getFieldName(Dimension.schema, Dimension.schema.shortCode)
        }
      ]
    }
  },
  level: {
    type: String,
    optional: true
  }
}
