import { check, Match } from 'meteor/check'
import { onServer } from '../../utils/arch'

export const createGetAllRoute = ({ context, schema, run }) => {
  check(context?.name, String)
  check(schema, Match.Maybe(Object))
  check(run, Match.Maybe(Function))

  return {
    path: `/api/${context.name}/get/all`,
    method: 'get',
    schema: schema,
    run: onServer(run)
  }
}
