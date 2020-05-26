import { Labels } from '../common/Labels'
import { Status } from '../types/Status'
import { UnitSet } from './UnitSet'
import { MediaLib } from './MediaLib'
import { getFieldName } from '../utils/getFieldName'

export const Unit = {}

Unit.name = 'unit'
Unit.label = 'unit.title'
Unit.icon = 'cube'
Unit.representative = 'shortCode'
Unit.useHistory = true

Unit.schema = {
  status: {
    type: Number,
    label: {
      name: Status.label,
      list: false,
      form: true,
      preview: true
    },
    allowedValues: Status.allowedValues,
    defaultValue: Status.defaultValue,
    dependency: {
      context: Status.name,
      field: Status.representative
    }
  },
  unitSet: {
    type: String,
    label: UnitSet.label,
    dependency: {
      collection: UnitSet.name,
      field: UnitSet.representative
    }
  },
  [Unit.representative]: {
    type: String,
    label: Labels[Unit.representative],
    value: {
      method: 'concat',
      input: [
        {
          type: 'field',
          source: 'unitSet',
          collection: UnitSet.name,
          field: UnitSet.representative
        },
        {
          type: 'value',
          value: '_'
        },
        {
          type: 'field',
          source: 'unitSet',
          collection: UnitSet.name,
          field: getFieldName(UnitSet.schema, UnitSet.schema.dimensionShort)
        },
        {
          type: 'increment',
          decimals: 4,
          collection: Unit.name
        }
      ]
    }
  },
  legacyId: {
    type: String,
    optional: true
  },
  title: {
    type: String,
    label: Labels.title
  },
  story: {
    type: Array,
    optional: true,
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'story.$': {
    type: Object
  },
  stimuli: {
    type: Array,
    optional: true,
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'stimuli.$': {
    type: Object,
  },
  instructions: {
    type: Array,
    optional: true,
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'instructions.$': {
    type: Object,
  },
  pages: {
    type: Array,
    optional: true,
    list: false
  },
  'pages.$': {
    type: Array,
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'pages.$.$': {
    type: Object
  }
}

const pageSchema = (fieldBase) => {
  Unit.schema[`${fieldBase}.type`] = { type: String }
  Unit.schema[`${fieldBase}.subtype`] = { type: String }
  Unit.schema[`${fieldBase}.value`] = { type: String }
  Unit.schema[`${fieldBase}.width`] = { type: String }
}

pageSchema('story.$')
pageSchema('stimuli.$')
pageSchema('instructions.$')
pageSchema('pages.$.$')
