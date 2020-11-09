export const createGetByIdRoute = ({ context, schema, run }) => {
  const definitions = {
    path: `/api/${context.name}/get/byId`,
    method: 'get',
    schema: schema
  }

  if (typeof run === 'function' && Meteor.isServer) {
    definitions.run = run
  }

  return definitions
}