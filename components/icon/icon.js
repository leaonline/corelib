import { Template } from 'meteor/templating'
import './icon.html'

Template.icon.helpers({
  iconAtts () {
    const data = Template.instance().data
    const fw = data.fw ? 'fa-fw' : ''
    const pulse = data.pulse ? 'fa-pulse' : ''
    const name = data.name
    const classAtts = `fa fas ${fw} fa-${name} ${pulse}`
    return {
      class: classAtts,
      title: data.title,
      'aria-title': data.title
    }
  },
  spanAtts () {
    const data = Template.instance().data
    return {
      class: data.class
    }
  }
})
