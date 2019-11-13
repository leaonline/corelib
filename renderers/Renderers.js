import { RendererConfig } from './RendererConfig'

const widthOptions = (i18n) => [
  { value: '12', label: i18n('grid.12') },
  { value: '8', label: i18n('grid.8') },
  { value: '6', label: i18n('grid.6') },
  { value: '4', label: i18n('grid.4') },
  { value: '2', label: i18n('grid.2') }
]

export const TaskRenderers = {
  factory: {
    name: 'factory',
    label: 'taskRenderers.factory',
    template: 'TaskRendererFactory',
    async load () {
      return import('./factory/TaskRendererFactory.js')
    },
    exclude: true
  },
  text: {
    name: 'text',
    schema: ({ i18n }) => ({
      type: {
        type: String,
        defaultValue: 'text',
        autoform: {
          type: 'hidden'
        }
      },
      subtype: {
        type: String,
        defaultValue: 'text',
        autoform: {
          type: 'hidden'
        }
      },
      value: {
        type: String,
        autoform: {
          type: 'textarea',
          rows: 4
        }
      },
      width: {
        type: String,
        defaultValue: '12',
        autoform: {
          firstOption: false,
          options () {
            return widthOptions(i18n)
          }
        }
      }
    }),
    label: 'taskRenderers.text',
    icon: 'align-justify',
    template: 'textRenderer',
    async load () {
      return import('./text/textRenderer')
    }
  },
  image: {
    name: 'image',
    schema: ({ i18n, imagesCollection, version, uriBase }) => ({
      type: {
        type: String,
        defaultValue: 'media',
        autoform: {
          type: 'hidden'
        }
      },
      subtype: {
        type: String,
        defaultValue: 'image',
        autoform: {
          type: 'hidden'
        }
      },
      value: {
        type: String,
        autoform: {
          type: 'imageSelect',
          imagesCollection: imagesCollection,
          save: 'url',
          uriBase: uriBase,
          version: version
        }
      },
      width: {
        type: String,
        defaultValue: 'col-12',
        autoform: {
          firstOption: false,
          options () {
            return widthOptions(i18n)
          }
        }
      }
    }),
    label: 'taskRenderers.image',
    icon: 'image',
    template: 'imageRenderer',
    async load () {
      return import('./image/imageRenderer')
    }
  },
  h5p: {
    name: 'h5p',
    schema: ({ i18n, version, uriBase, h5p }) => ({
      type: {
        type: String,
        defaultValue: 'item',
        autoform: {
          type: 'hidden'
        }
      },
      subtype: {
        type: String,
        defaultValue: 'h5p',
        autoform: {
          type: 'hidden'
        }
      },
      value: {
        type: String,
        autoform: {
          type: 'h5p',
          h5p
        }
      },
      width: {
        type: String,
        defaultValue: 'col-12',
        autoform: {
          firstOption: false,
          options () {
            return widthOptions(i18n)
          }
        }
      }
    }),
    label: 'taskRenderers.h5p',
    icon: 'edit',
    template: 'h5pRenderer',
    async load () {
      return import('./h5p/h5pRenderer')
    },
    configure ({ renderUrl }) {
      RendererConfig.h5pRenderUrl = renderUrl
    }
  }
}