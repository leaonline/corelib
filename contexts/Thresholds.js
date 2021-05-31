import { createGetAllRoute } from '../decorators/routes/getAll'

/**
 * Describes global thresholds for evaluations that are necessary to define a
 * competency or alpha-level as being
 * [fully, mostly, partially, not] accomplished.
 *
 * These values can be overridden by the context documents.
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

export const Thresholds = {
  name: 'thresholds',
  label: 'thresholds.title',
  icon: 'layer-group',
  isConfigDoc: true
}

Thresholds.schema = {

  /**
   * This defined the minimum amount of competencies that have to be tested
   * during one or more sessions in order to allow a response about, whether
   * a competency is fulfilled. Below this amount we can't really say.
   */
  minCountCompetency: {
    type: Number,
    min: 0
  },

  thresholdsCompetency: {
    type: Object,
    label: 'competency.thresholds'
  },

  /**
   * At this level the competency can be taken into account for estimating
   * the alpa-level of an attendee.
   */
  'thresholdsCompetency.accomplished': {
    type: Number,
    label: 'thresholds.accomplished',
    min: 0,
    max: 1
  },

  /**
   * Used for information but not for calculating alpha-levels
   */
  'thresholdsCompetency.nearAccomplished': {
    type: Number,
    label: 'thresholds.nearAccomplished',
    min: 0,
    max: 1
  },

  /**
   * Used for information but not for calculating alpha-levels
   */
  'thresholdsCompetency.partialAccomplished': {
    type: Number,
    label: 'thresholds.partialAccomplished',
    min: 0,
    max: 1
  },

  /**
   * Usually 0
   */
  'thresholdsCompetency.notAccomplished': {
    type: Number,
    label: 'thresholds.notAccomplished',
    min: 0,
    max: 1,
    defaultValue: 0
  },

  minCountAlphaLevel: {
    type: Number,
    min: 0
  },

  thresholdsAlphaLevel: {
    type: Object,
    label: 'alphaLevel.thresholds'
  },

  /**
   * At this level we can estimate an alpha level to be accomplished
   */
  'thresholdsAlphaLevel.accomplished': {
    type: Number,
    label: 'thresholds.accomplished',
    min: 0,
    max: 1
  },

  'thresholdsAlphaLevel.notAccomplished': {
    type: Number,
    label: 'thresholds.notAccomplished',
    min: 0,
    max: 1,
    defaultValue: 0
  }
}

Thresholds.methods = {}
Thresholds.helpers = {}
Thresholds.publications = {}
Thresholds.routes = {}
Thresholds.routes.all = createGetAllRoute({
  context: Thresholds,
  schema: {
    ids: {
      type: Array,
      optional: true
    },
    'ids.$': String
  }
})
