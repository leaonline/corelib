import { check, Match } from 'meteor/check'
import { onServer } from '../../utils/arch'

export const createGetByIdRoute = ({ context, schema, run }) => {
  check(context?.name, String)
  check(schema, Match.Maybe(Object))
  check(run, Match.Maybe(Function))

  return {
    path: `/api/${context.name}/get/byId`,
    method: 'get',
    schema: schema || { _id: String },
    run: onServer(run)
  }
}
