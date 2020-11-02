export const createPageSchema = context => (field) => {
  Object.assign(context.schema[field], {
    type: Object,
    optional: true,
    blackbox: true,
    custom (...args) {
      // TODO validate based on element type/subtype
    },
    isPageContent: true
  })
}
