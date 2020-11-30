import { onServer } from '../../utils/arch'
import { check, Match } from 'meteor/check'
import { Meteor } from "meteor/meteor"

export const createGetAllRoute = ({ context, schema, run }) => {
  check(context?.name, String)
  check(schema, Match.Maybe(Object))
  check(run, Match.Maybe(Function))

  const definitions = {
    path: `/api/${context.name}/get/all`,
    method: 'get',
    schema: schema
  }

  if (typeof run === 'function' && Meteor.isServer) {
    definitions.run = run
  }

  return definitions
}
