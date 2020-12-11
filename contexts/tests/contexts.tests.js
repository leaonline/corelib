/* eslint-env mocha */
import { expect } from 'chai'
import { createSchema } from '../../test-helpers.tests'
// contexts
import { Competency } from '../Competency'
import { CompetencyCategory } from '../CompetencyCategory'
import { Dimension } from '../Dimension'
import { Field } from '../Field'
import { Level } from '../Level'
import { MediaLib } from '../MediaLib'
import { Unit } from '../Unit'
import { UnitSet } from '../UnitSet'
import { getType } from '../../utils/object/getType'

const allContexts = [
  Competency,
  CompetencyCategory,
  Dimension,
  Field,
  Level,
  MediaLib,
  Unit,
  UnitSet
]

const routeSchema = createSchema({
  path: String,
  method: String,
  schema: {
    type: Object,
    optional: true,
    blackbox: true // we test the schema by creating it
  },
  run: {
    type: Function,
    optional: true
  }
})

const methodAndPublicationSchema = createSchema({
  name: String,
  schema: {
    type: Object,
    optional: true,
    blackbox: true // we test the schema by creating it
  },
  run: {
    type: Function,
    optional: true
  }
})

describe('contexts', function () {
  allContexts.forEach(context => {
    describe(context.name, function () {
      it ('has valid minimal context properties', function () {
        routeSchema[Math.random().toString()] = () => {}
        expect(context.name).to.be.a('string')
        expect(context.label).to.be.a('string').that.includes('.')
        expect(context.icon).to.be.a('string')
      })
      it ('has a valid representative', function () {
        if (typeof context.representative !== 'string' && !Array.isArray(context.representative)) {
          expect.fail('neither String, nor Array')
        }
      })
      it ('has a valid schema', function () {
        createSchema(context.schema, {
          clean: {
            autoConvert: false,
            filter: false,
            getAutoValues: false,
            removeEmptyStrings: false,
            removeNullsFromArrays: false,
            trimStrings: false,
          },
          humanizeAutoLabels: false,
          requiredByDefault: false,
        })
      })

      const testMethodOrPublicationOrRoutes = (target, validationSchema) => {
        if (!target) return

        const actualType = getType(target)
        if (actualType !== '[object Object]') {
          expect.fail(`expected [object Object], got ${actualType}`)
        }

        Object
          .values(target)
          .forEach(def => {
            // test basic structure
            validationSchema.validate(def)

            // deep schema test
            if (def.schema) {
              createSchema(def.schema)
            }
          })
      }

      it ('has optional methods', function () {
        testMethodOrPublicationOrRoutes(context.methods, methodAndPublicationSchema)
      })
      it ('has optional publications', function () {
        testMethodOrPublicationOrRoutes(context.publications, methodAndPublicationSchema)
      })
      it ('has optional routes', function () {
        testMethodOrPublicationOrRoutes(context.routes, routeSchema)
      })
    })
  })
})
