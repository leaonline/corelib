import { Template } from 'meteor/templating'
import { Random } from 'meteor/random'
import lozad from 'lozad'
import './image.html'

const imageClass = 'lea-image'

Template.image.onCreated(function () {
  const instance = this
  instance.id = Random.id(4)
})

Template.image.helpers({
  attributes () {
    const instance = Template.instance()
    const { data } = instance
    const customClasses = data.class || ''
    const shadowClass = data.shadow ? 'shadow' : ''
    const classes = `${imageClass} ${shadowClass} ${customClasses}`
    const obj = {}

    Object.keys(data).forEach(key => {
      if (key.includes('data-') || key.includes('aria-')) {
        obj[key] = data[key]
      }
    })

    return Object.assign(obj, {
      'data-id': instance.id,
      title: data.title,
      alt: data.alt,
      'aria-title': data.title,
      width: data.width,
      height: data.height,
      class: classes,
      'data-src': data.src
    })
  }
})

Template.image.onRendered(function () {
  const instance = this
  const $image = instance.$(`[data-id="${instance.id}"]`)
  const image = $image.get(0)

  if (!image) {
    return
  }

  const observer = lozad(image)
  observer.observe()

  instance.autorun(function () {
    const data = Template.currentData()
    const newDataSrc = data.src
    const dataSrc = $image.prop('src')

    if (newDataSrc && dataSrc && newDataSrc !== dataSrc) {
      $image.prop('src', '*')
      $image.removeAttr('data-loaded')
      observer.observe()
    }
  })
})
