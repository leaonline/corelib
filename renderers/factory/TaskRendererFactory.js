import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { TaskRenderers } from '../Renderers'
import './TaskRendererFactory.html'

// keep this global to ensure, that
// renderers are loaded only once in
// a running application session
const loaded = new ReactiveDict()

Template.TaskRendererFactory.onCreated(function () {
  const instance = this
  instance.state.set('loadComplete', false)
  instance.autorun(() => {
    const data = Template.currentData()
    const content = data.content || {}

    // skip current autorun if we have no content
    // or the template has already been loaded
    // for this current content type
    if (!content || loaded.get(content.subtype)) {
      return
    }

    const rendererContext = TaskRenderers.get(content.subtype)
    if (!rendererContext) {
      // something weirdly failed, we set an error context here
      const error = new Meteor.Error('taskRenderers.error', 'taskRenderers.missing', content.subtype)
      instance.state.set({ error })
      if (content.onLoadError) content.onLoadError(error, content.subtype)
      return
    }

    rendererContext.load()
      .then(() => {
        loaded.set(content.subtype, rendererContext.template)
        if (content.onLoadComplete) content.onLoadComplete(content.subtype)
        instance.state.set('loadComplete', true)
      })
      .catch(error => {
        if (content.onLoadError) content.onLoadError(error, content.subtype)
        instance.state.set({ error })
      })
  })
})

Template.TaskRendererFactory.helpers({
  loadComplete () {
    return Template.getState('loadComplete')
  },
  error () {
    return Template.getState('error')
  },
  templateContext () {
    const data = Template.currentData()
    const { content } = data
    if (!content) return

    content.type = data.type
    const template = loaded.get(content.subtype)
    return template && { template, data: content }
  }
})
