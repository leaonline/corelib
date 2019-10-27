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

  instance.autorun(() => {
    const data = Template.currentData()
    const { content } = data


    // skip current autorun if we have no content
    // or the template has already been loaded
    // for this current content type
    if (!content || loaded.get(content.subtype)) {
      return
    }

    const rendererContext = TaskRenderers[ content.subtype ]
    if (!rendererContext) {
      // something weirdly failed, what to do here? FIXME
      return
    }

    rendererContext
      .load()
      .then(() => loaded.set(content.subtype, rendererContext.template))
      .catch(e => console.error(e))
  })
})

Template.TaskRendererFactory.helpers({
  templateContext () {
    const data = Template.currentData()
    const { content } = data
    if (!content) return

    content.type = data.type
    const template = loaded.get(content.subtype)
    return template && { template, data: content }
  }
})
