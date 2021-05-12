import { Labels } from '../i18n/Labels'
import { Dimension } from './Dimension'
import { Field } from './Field'
import { Level } from './Level'
import { UnitSet } from './UnitSet'
import { getFieldName } from '../utils/getFieldName'
import { createGetAllRoute } from '../decorators/routes/getAll'
import { createGetByIdRoute } from '../decorators/routes/createGetByIdRoute'

/**
 * A Test-Cycle represents the bridge between
 * Field/Dimension/Level <== and ==> 1..N UnitSet(s)
 *
 * While a UnitSet already includes 1..N Units, these rather
 * represent a collection of Units to some kind of "Storyline"
 * and may not be representative for a full-spectrum test.
 *
 * Therefore, this entity is introduced to generate the overall
 * Test-Collection that needs to be done to pass one cycle of tests.
 */
export const TestCycle = {}

TestCycle.name = 'testCycle'
TestCycle.label = 'testCycle.title'
TestCycle.icon = 'sync-alt'
TestCycle.representative = 'shortCode'

TestCycle.schema = {
  [TestCycle.representative]: {
    type: String,
    label: Labels[TestCycle.representative],
    value: {
      method: 'concat',
      input: [
        {
          type: 'value',
          value: 'Test_'
        },
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
          field: getFieldName(Dimension.schema, Dimension.schema.shortCode)
        },
        {
          type: 'document',
          source: 'level',
          collection: Level.name,
          field: getFieldName(Level.schema, Level.schema[Level.representative])
        }
      ]
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
  dimension: {
    type: String,
    label: Dimension.label,
    dependency: {
      collection: Dimension.name,
      field: Dimension.representative
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

  isLegacy: {
    type: Boolean,
    label: Labels.legacy,
    optional: true
  },

  /**
   * Self-assessment will be displayed for the user on the diagnostic app,
   * and should app to decide, whether the TestCycle is appropriate.
   */
  selfAssessment: {
    type: String,
    optional: true,
    max: 5000
  },

  progress: {
    type: Number,
    optional: true
  },

  unitSets: {
    type: Array,
    optional: true,
    isSortable: true,
    dependency: {
      collection: UnitSet.name,
      field: UnitSet.representative,
      filter: {
        // filter by field/dimension/level
        fields: [
          'field',
          'dimension',
          'level'
        ]
      }
    }

  },
  'unitSets.$': {
    type: String
  }
}

/**
 * Routes are a "contract" between apps to have the same knowledge about
 * where to get the data from.
 * TODO: routes should be exchanged when services "talk" to each other,
 * TODO: thus there is no tight coupling.
 */
TestCycle.routes = {}
TestCycle.routes.all = createGetAllRoute({
  context: TestCycle,
  schema: {

    // there should always be only one field at a time to be queried3

    field: {
      type: String,
      optional: true
    },

    // the legacy flag is used to return all TestCycles, that are part of
    // ot.lea (which is here defined as legacy, since the competency model
    // is a legacy model)

    isLegacy: {
      type: String,
      optional: true,
      allowedValues: ['true', 'false']
    }
  }
})

TestCycle.routes.byId = createGetByIdRoute({
  context: TestCycle
})
