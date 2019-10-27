export const getBsType = (type, outline) => {
  if (!type) return outline ? 'outline-secondary' : 'secondary'
  return outline ? `outline-${type}` : type
}
