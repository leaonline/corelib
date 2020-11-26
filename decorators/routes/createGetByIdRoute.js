import { Meteor } from 'meteor/meteor'
import { check, Match } from 'meteor/check'

export const createGetByIdRoute = ({ context, schema, run }) => {
  check(context?.name, String)
  check(schema, Match.Maybe(Object))
  check(run, Match.Maybe(Function))

  const definitions = {
    path: `/api/${context.name}/get/byId`,
    method: 'get',
    schema: schema || { _id: String }
  }

  if (typeof run === 'function' && Meteor.isServer) {
    definitions.run = run
  }

  return definitions
}
