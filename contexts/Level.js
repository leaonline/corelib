import { Status } from '../types/Status'
import { Labels } from '../i18n/Labels'
import { createGetAllRoute } from '../decorators/routes/getAll'

export const Level = {}
Level.name = 'level'
Level.label = 'level.title'
Level.icon = 'chart-line'
Level.representative = 'index'
Level.useHistory = true

Level.schema = {
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
  [Level.representative]: {
    type: Number,
    min: 1
  },
  title: {
    type: String,
    label: Labels[Level.representative]
  },
  description: {
    type: String,
    label: Labels.description,
    optional: true
  }
}

Level.routes = {}
Level.routes.all = createGetAllRoute({ context: Level })
