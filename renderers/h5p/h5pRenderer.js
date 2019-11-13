import { Template } from 'meteor/templating'
import { RendererConfig } from '../RendererConfig'
import './h5pRenderer.html'

Template.h5pRenderer.helpers({
  contentUrl () {
    const data = Template.instance().data
    console.log(data, RendererConfig.h5pRenderUrl)
    return data.value && `${RendererConfig.h5pRenderUrl}${data.value}`
  }
})
