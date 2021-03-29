import { Field } from './Field'
import { Status } from '../types/Status'
import { Dimension } from '../contexts/Dimension'
import { Level } from './Level'
import { Labels } from '../i18n/Labels'
import { getFieldName } from '../utils/getFieldName'
import { createPageEntrySchema, createPageSchema } from '../validation/pageSchema'
import { trapCircular } from '../utils/trapCircular'
import { createGetAllRoute } from '../decorators/routes/getAll'
import { createGetByIdRoute } from '../decorators/routes/createGetByIdRoute'

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
          type: 'document',
          source: 'field',
          collection: Field.name,
          field: getFieldName(Field.schema, Field.schema.shortCode)
        },
        {
          type: 'value',
          value: '_'
        },
        {
          type: 'document',
          source: 'dimension',
          collection: Dimension.name,
          field: getFieldName(Dimension.schema, Dimension.schema.shortNum)
        },
        {
          type: 'increment',
          decimals: 3,
          collection: UnitSet.name,
          filter: {
            fields: ['field', 'dimension']
          }
        }
      ]
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
          type: 'document',
          source: 'dimension',
          collection: Dimension.name,
          field: getFieldName(Dimension.schema, Dimension.schema.shortCode)
        }
      ]
    }
  },
  level: {
    type: String,
    label: Level.label,
    dependency: {
      collection: Level.name,
      field: Level.representative
    }
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
  isLegacy: {
    type: Boolean,
    label: Labels.legacy,
    optional: true
  },
  title: {
    type: String,
    label: Labels.title,
    optional: true
  },
  story: createPageSchema(),
  'story.$': createPageEntrySchema(),
  units: {
    type: Array,
    optional: true,
    isSortable: true,
    dependency: trapCircular(function () {
      const { Unit } = require('./Unit')
      const { getFieldName } = require('../utils/getFieldName')

      return {
        collection: Unit.name,
        field: Unit.representative,
        filter: {
          // filter units with by field unitSet with value _id
          // of this current edited unitSet doc (= self)
          self: getFieldName(Unit.schema, Unit.schema.unitSet)
        }
      }
    })
  },
  'units.$': {
    type: String
  }
}

/**
 * Routes are a "contract" between apps to have the same knowledge about
 * where to get the data from.
 * TODO: routes should be exchanged when services "talk" to each other,
 * TODO: thus there is no tight coupling.
 */
UnitSet.routes = {}
UnitSet.routes.all = createGetAllRoute({
  context: UnitSet,
  schema: {

    // there should always be only one field at a time to be queried

    field: {
      type: String,
      optional: true
    },

    // there should also be only one job to be queried, note that the job
    // makes only sense if the field is part of the query and the job is
    // part of the field

    job: {
      type: Number,
      optional: true
    },

    // the legacy flag is used to return all UnitSets, that are part of
    // ot.lea (which is here defined as legacy, since the competency model
    // is a legacy model)

    isLegacy: {
      type: String,
      optional: true,
      allowedValues: ['true', 'false']
    }
  }
})

UnitSet.routes.byId = createGetByIdRoute({
  context: UnitSet
})
