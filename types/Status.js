export const Status = {
  name: 'status',
  label: 'status.title',
  icon: 'cubes',
  isType: String,
  representative: 'index',
  useHistory: false
}

Status.types = {
  inProgress: {
    index: 0,
    name: 'inProgress',
    label: 'status.inProgress',
    type: 'secondary',
    icon: 'edit',
  },
  inReview: {
    index: 1,
    name: 'inReview',
    label: 'status.inReview',
    type: 'warning',
    icon: 'comments'
  },
  deprecated: {
    index: 2,
    name: 'deprecated',
    label: 'status.deprecated',
    type: 'danger',
    icon: 'thumbs-down'
  },
  published: {
    index: 3,
    name: 'published',
    label: 'status.published',
    type: 'success',
    icon: 'thumbs-up'
  }
}

Status.allowedValues = Object.values(Status.types).map(entry => entry[Status.representative])
Status.defaultValue = Status.types.inProgress[Status.representative]
