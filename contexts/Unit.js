import { Labels } from '../i18n/Labels'
import { Status } from '../types/Status'
import { UnitSet } from './UnitSet'
import { getFieldName } from '../utils/getFieldName'
import { createPageEntrySchema, createPageSchema } from '../validation/pageSchema'
import { createGetAllRoute } from '../decorators/routes/getAll'
import { createGetByIdRoute } from '../decorators/routes/createGetByIdRoute'

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
            fields: [
              'unitSet'
            ]
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
    label: Labels.title,
    optional: true
  },
  stimuli: createPageSchema(),
  'stimuli.$': createPageEntrySchema(),

  instructions: createPageSchema(),
  'instructions.$': createPageEntrySchema(),
  pages: {
    type: Array,
    label: 'unit.pages'
  },
  'pages.$': {
    type: Object,
    label: 'unit.page'
  },
  'pages.$.instructions': createPageSchema({
    label: 'unit.pageInstructions'
  }),
  'pages.$.instructions.$': createPageEntrySchema(),

  'pages.$.content': createPageSchema({
    label: 'unit.pageContent'
  }),
  'pages.$.content.$': createPageEntrySchema()
}

Unit.routes = {}
Unit.routes.all = createGetAllRoute({
  context: Unit,
  schema: {
    unitSet: {
      type: String,
      optional: true
    },
    ids: {
      type: Array,
      optional: true
    },
    'ids.$': String
  }
})

Unit.routes.byId = createGetByIdRoute({
  context: Unit
})
