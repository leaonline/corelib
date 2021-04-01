import { Status } from '../types/Status'
import { Dimension } from './Dimension'
import { Labels } from '../i18n/Labels'
import { getFieldName } from '../utils/getFieldName'
import { createGetAllRoute } from '../decorators/routes/getAll'

/**
 * Describes a certain level of competency. Not to be confused with {Level} which
 * describes a determined level of difficulty.
 *
 * @type {{
 *  name: string,
 *  label: string,
 *  icon: string,
 *  representative: string
 *  schema: Object,
 *  helpers: Object,
 *  methods: Object,
 *  publications: Object,
 *  routes: Object
 *  }}
 */

export const AlphaLevel = {
  name: 'alphaLevel',
  label: 'alphaLevel.title',
  icon: 'font',
  representative: 'shortCode'
}

AlphaLevel.schema = {
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

  /**
   * Required. AlphaLevel is always determent to a Dimension
   */
  dimension: {
    type: String,
    label: Dimension.label,
    dependency: {
      collection: Dimension.name,
      field: Dimension.representative
    }
  },

  /**
   * Not to be confused with {Level}
   */

  level: {
    type: Number,
    min: 1,
    max: Number.MAX_SAFE_INTEGER
  },

  /**
   * Identifier, which consists of pattern <dimension>-<alphalevel.level>
   */
  shortCode: {
    type: String,
    max: 25,
    value: {
      method: 'concat',
      input: [
        {
          type: 'document',
          source: 'dimension',
          collection: Dimension.name,
          field: getFieldName(Dimension.schema, Dimension.schema.shortCode)
        },
        { type: 'value', value: '.' },
        {
          type: 'field',
          source: 'level'
        }
      ]
    }
  },

  /**
   * description is also the response for the attendees
   */

  description: {
    type: String,
    label: Labels.description,
    max: 3000
  },

  /**
   * if any threshold is not set, we fallback to global thresholds
   */

  thresholds: {
    type: Object,
    optional: true
  },
  'thresholds.accomplished': {
    type: Number,
    label: 'thresholds.accomplished',
    optional: true,
    min: 0,
    max: 1
  }
}

AlphaLevel.helpers = {}
AlphaLevel.methods = {}
AlphaLevel.publications = {}

AlphaLevel.routes = {}
AlphaLevel.routes.all = createGetAllRoute({
  context: AlphaLevel,
  schema: {
    ids: {
      type: Array,
      optional: true
    },
    'ids.$': String
  }
})
