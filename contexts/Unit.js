import { Labels } from '../i18n/Labels'
import { Status } from '../types/Status'
import { UnitSet } from './UnitSet'
import { MediaLib } from './MediaLib'
import { getFieldName } from '../utils/getFieldName'
import { createPageSchema } from '../utils/pageSchema'
import { createGetAllRoute } from '../decorators/routes/getAll'

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
          type: 'document',
          source: 'unitSet',
          collection: UnitSet.name,
          field: UnitSet.representative
        },
        {
          type: 'value',
          value: '_'
        },
        {
          type: 'document',
          source: 'unitSet',
          collection: UnitSet.name,
          field: getFieldName(UnitSet.schema, UnitSet.schema.dimensionShort)
        },
        {
          type: 'increment',
          decimals: 4,
          collection: Unit.name,
          filter: {
            fields: ['unitSet']
          }
        }
      ]
    }
  },
  legacyId: {
    type: String,
    optional: true,
    label: 'unit.legacyId'
  },
  title: {
    type: String,
    label: Labels.title
  },
  stimuli: {
    type: Array,
    optional: true,
    label: 'unit.stimuli',
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'stimuli.$': {
    type: Object,
    label: Labels.entry
  },
  instructions: {
    type: Array,
    optional: true,
    label: 'unit.instructions',
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'instructions.$': {
    type: Object,
    label: Labels.entry
  },
  pages: {
    type: Array,
    label: 'unit.pages',
    optional: true
  },
  'pages.$': {
    type: Object,
    label: 'unit.page'
  },
  'pages.$.instructions': {
    type: Array,
    optional: true,
    label: 'unit.pageInstructions',
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'pages.$.instructions.$': {
    type: Object
  },
  'pages.$.content': {
    type: Array,
    optional: true,
    label: 'unit.pageContent',
    dependency: {
      filesCollection: MediaLib.name,
      version: 'original'
    }
  },
  'pages.$.content.$': {
    type: Object
  }
}

const pageSchema = createPageSchema(Unit)
pageSchema('stimuli.$')
pageSchema('instructions.$')
pageSchema('pages.$.instructions.$')
pageSchema('pages.$.content.$')

console.log(Unit.schema)

Unit.routes = {}
Unit.routes.all = createGetAllRoute({
  context: Unit,
  schema: {
    unitSet: {
      type: String,
      optional: true
    }
  }
})
