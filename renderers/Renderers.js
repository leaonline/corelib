const widthOptions = (i18n) => [
  { value: '12', label: i18n('grid.12') },
  { value: '8', label: i18n('grid.8') },
  { value: '6', label: i18n('grid.6') },
  { value: '4', label: i18n('grid.4') },
  { value: '2', label: i18n('grid.2') }
]

export const RendererGroups = {
  layout: {
    name: 'layout',
    label: 'taskRenderers.layout.title'
  },
  items: {
    name: 'items',
    label: 'taskRenderers.items.title'
  }
}

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
  page: {
    name: 'page',
    label: 'taskRenderers.page',
    template: 'taskPageRenderer',
    async load () {
      console.log('load task page renderer')
      return import('./page/taskPageRenderer.js')
    },
    exclude: true
  },
  text: {
    name: 'text',
    group: RendererGroups.layout,
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
    label: 'taskRenderers.layout.text.title',
    icon: 'align-justify',
    template: 'textRenderer',
    async load () {
      return import('./text/textRenderer')
    }
  },
  markdown: {
    name: 'markdown',
    group: RendererGroups.layout,
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
        defaultValue: 'markdown',
        autoform: {
          type: 'hidden'
        }
      },
      value: {
        type: String,
        autoform: {
          type: 'markdown'
        }
      },
      padding: {
        type: Number,
        optional: true,
        defaultValue: 0,
        min: 0,
        max: 5
      },
      lineHeight: {
        type: Number,
        optional: true,
        defaultValue: 0,
        min: 0,
        max: 5
      },
      background: {
        type: String,
        optional: true,
        autoform: {
          options: () => [
            { value: 'light', label: i18n('colors.light') },
            { value: 'dark', label: i18n('colors.dark') }
          ]
        }
      },
      textColor: {
        type: String,
        optional: true,
        autoform: {
          options: () => [
            { value: 'light', label: i18n('colors.light') },
            { value: 'dark', label: i18n('colors.dark') }
          ]
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
    label: 'taskRenderers.layout.markdown.title',
    icon: 'hashtag',
    template: 'markdownRenderer',
    async load () {
      return import('./markdown/markdownRenderer')
    }
  },
  image: {
    name: 'image',
    group: RendererGroups.layout,
    schema: ({ i18n, imageForm }) => ({
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
        autoform: imageForm
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
    label: 'taskRenderers.layout.image.title',
    icon: 'image',
    template: 'imageRenderer',
    async load () {
      return import('./image/imageRenderer')
    }
  },
  /*
  h5p: {
    name: 'h5p',
    group: RendererGroups.items,
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
  },
  */
  cloze: {
    name: 'cloze',
    group: RendererGroups.items,
    label: 'taskRenderers.items.cloze.title',
    icon: 'edit',
    template: 'clozeItemRenderer',
    instructions: 'taskRenderers.items.cloze.instructions',
    async load () {
      return import('./items/cloze/clozeItemRenderer')
    }
  },
  singleChoice: {
    name: 'singleChoice',
    group: RendererGroups.items,
    label: 'taskRenderers.items.singleChoice.title',
    icon: 'list-ul',
    template: 'singleChoiceItemRenderer',
    instructions: 'taskRenderers.items.singleChoice.instructions',
    async load () {
      return import('./items/singlechoice/singleChoiceItemRenderer')
    }
  },
  scoring: {
    name: 'scoring',
    template: 'itemScoringRenderer',
    async load () {
      return import('./scoring/scoring')
    },
    exclude: true
  }
}
