export const MediaLib = {
  name: 'mediaLib',
  collectionName: 'mediaLib',
  isFilesCollection: true,
  label: 'mediaLib.title',
  original: 'original',
  preview: 'thumbnail',
  icon: 'images',
  accept: 'image/*',
  extensions: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bpm']
}

MediaLib.schema = {}

MediaLib.publications = {}

MediaLib.publications.all = {
  name: 'mediaLib.publications.all',
  schema: {}
}

MediaLib.methods = {}

MediaLib.methods.remove = {
  name: 'mediaLib.methods.remove',
  schema: {
    _id: String
  }
}

MediaLib.routes = {}

MediaLib.routes.mediaUrl = {
  path: '/media/url',
  method: 'get',
  schema: {
    _id: String
  }
}
