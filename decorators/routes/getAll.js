import { onServer } from '../../utils/arch'

export const createGetAllRoute = ({ context, schema, run }) => ({
  path: `/api/${context.name}/get/all`,
  method: 'get',
  schema: schema,
  run: run && onServer(run)
})
