import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import './h5pRenderer.html'

const settings = Meteor.settings.public.hosts.items
const { renderUrl } = settings

Template.h5pRenderer.helpers({
  contentUrl () {
    const data = Template.instance().data
    console.log(data, renderUrl)
    return data.value && `${renderUrl}${data.value}`
  }
})
