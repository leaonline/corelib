export const resolveRepresentative = (doc, representative, separator = ' - ') =>
  Array.isArray(representative)
    ? representative.map(field => doc[field]).join(separator)
    : doc[representative]
