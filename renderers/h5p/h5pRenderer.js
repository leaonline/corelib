import { Template } from 'meteor/templating'
import { RendererConfig } from '../RendererConfig'
import './h5pRenderer.html'

Template.h5pRenderer.helpers({
  contentUrl () {
    const data = Template.instance().data
    return data.value && `${RendererConfig.h5pRenderUrl}${data.value}&userId=${data.userId}&sessionId=${data.sessionId}&taskId=${data.taskId}&page=${data.page}`
  }
})
