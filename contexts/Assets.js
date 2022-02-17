export const Assets = {
  name: 'assets',
  collectionName: 'assets',
  isFilesCollection: true,
  label: 'assets.title',
  original: 'original',
  icon: 'file',
  accept: '*',
  extensions: null, // accept all
  representative: 'name',
  isPublic: true
}

Assets.schema = {}

Assets.publications = {}
Assets.publications.all = {
  name: 'assets.publications.all',
  schema: {}
}

Assets.methods = {}
Assets.methods.remove = {
  name: 'assets.methods.remove',
  schema: {
    _id: String
  }
}

Assets.routes = {}
Assets.routes.assetUrl = {
  path: '/assets/url',
  method: 'get',
  schema: {
    _id: String
  }
}
