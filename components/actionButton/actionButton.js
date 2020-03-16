import { Template } from 'meteor/templating'
import { getBsType } from '../../utils/bootstrapUtils'

import '../soundbutton/soundbutton'
import './actionButton.html'

Template.actionButton.helpers({
  sound () {
    const instance = Template.instance()
    return instance.data.sound !== false
  },
  leftIcon () {
    const instance = Template.instance()
    const { data } = instance
    return data.icon && data.iconPos !== 'right'
  },
  rightIcon () {
    const instance = Template.instance()
    const { data } = instance
    return data.icon && data.iconPos === 'right'
  },
  attributes () {
    const instance = Template.instance()
    const { data } = instance

    const btnType = getBsType(data.type, data.outline)
    const btnBlock = data.block ? 'btn-block' : ''
    const customClass = data.btnClass || ''
    const activeClass = data.active ? 'active' : ''
    const bgClass = `lea-action-btn-${btnType}`

    const atts = {
      id: data.id,
      title: data.title,
      class: `lea-action-button ml-2 btn btn-${btnType} ${btnBlock} ${bgClass} ${activeClass} ${customClass}`,
      'aria-label': data.label || data.title || 'button'
    }

    if (data.href) {
      atts.href = data.href
    }

    Object.keys(data).forEach(key => {
      if (key.indexOf('data-') === -1) return
      atts[key] = data[key]
    })

    return atts
  },
  groupAttributes () {
    const instance = Template.instance()
    const { data } = instance

    const customClass = data.class || ''
    const defaultClass = data.sound !== false ? 'd-flex align-items-center' : ''

    return {
      id: data.id,
      title: data.title,
      class: `${defaultClass} ${customClass}`
    }
  }
})
