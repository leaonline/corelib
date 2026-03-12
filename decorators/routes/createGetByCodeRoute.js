import { check, Match } from 'meteor/check'
import { onServer } from '../../utils/arch'

export const createGetByCodeRoute = ({ context, schema, run }) => {
  check(context?.name, String)
  check(schema, Match.Maybe(Object))
  check(run, Match.Maybe(Function))

  return {
    path: `/api/${context.name}/get/byCode`,
    method: 'get',
    schema: schema || { shortCode: String },
    run: onServer(run)
  }
}
