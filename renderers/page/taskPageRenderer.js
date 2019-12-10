/* global EventTarget Event */
import { Template } from 'meteor/templating'
import { Meteor } from 'meteor/meteor'
import '../factory/TaskRendererFactory'
import '../../components/actionButton/actionButton'

import './taskPageRenderer.html'

function onInput (...args) {
  console.info('on input', ...args)
}

Template.taskPageRenderer.onCreated(function () {
  const instance = this
  instance.collector = new EventTarget()

  instance.autorun(() => {
    const data = Template.currentData()
    const taskDoc = data.doc
    const color = data.color || 'secondary'
    const currentPageCount = data.currentPageCount || 0
    const sessionId = data.sessionId

    instance.state.set('sessionDoc', sessionId)
    instance.state.set('taskDoc', taskDoc)
    instance.state.set('dimension', taskDoc.dimension)
    instance.state.set('taskStory', taskDoc.story)
    instance.state.set('maxPages', taskDoc.pages.length)
    instance.state.set('currentPageCount', currentPageCount)
    instance.state.set('currentPage', taskDoc.pages[currentPageCount])
    instance.state.set('hasNext', taskDoc.pages.length > currentPageCount + 1)
    instance.state.set('color', color)
  })
})

Template.taskPageRenderer.helpers({
  loadComplete () {
    const instance = Template.instance()
    return instance.state.get('taskDoc')
  },
  taskStory () {
    return Template.getState('taskStory')
  },
  taskDoc () {
    return Template.getState('taskDoc')
  },
  currentTaskCount () {
    return Template.getState('currentTaskCount')
  },
  maxTasksCount () {
    return Template.getState('maxTasksCount')
  },
  currentType () {
    return Template.getState('color')
  },
  dimension () {
    return Template.getState('dimension')
  },
  currentPage () {
    return Template.getState('currentPage')
  },
  currentPageCount () {
    return Template.getState('currentPageCount') + 1
  },
  maxPages () {
    return Template.getState('maxPages')
  },
  hasNext () {
    return Template.getState('hasNext')
  },
  hasPrev () {
    return Template.getState('hasPrev')
  },
  itemData (content) {
    const instance = Template.instance()
    const sessionId = instance.state.get('sessionId')
    const taskDoc = instance.state.get('taskDoc')
    const page = instance.state.get('currentPageCount')
    const taskId = taskDoc.taskId
    const userId = Meteor.userId()
    const color = instance.state.get('color')
    const collector = instance.collector
    return Object.assign({}, content, {
      userId,
      sessionId,
      taskId,
      page,
      color,
      onInput: onInput.bind(this),
      collector: collector
    })
  }
})

Template.taskPageRenderer.events({
  'click .lea-pagenav-button' (event, templateInstance) {
    event.preventDefault()
    const action = templateInstance.$(event.currentTarget).data('action')
    const taskDoc = templateInstance.state.get('taskDoc')
    const currentPageCount = templateInstance.state.get('currentPageCount')
    const newPage = {}

    if (action === 'next') {
      newPage.currentPageCount = currentPageCount + 1
      newPage.currentPage = taskDoc.pages[newPage.currentPageCount]
      newPage.hasNext = (newPage.currentPageCount + 1) < taskDoc.pages.length
    }

    if (action === 'back') {
      newPage.currentPageCount = currentPageCount - 1
      newPage.currentPage = taskDoc.pages[newPage.currentPageCount]
      newPage.hasNext = (newPage.currentPageCount + 1) < taskDoc.pages.length
    }

    if (!newPage.currentPage) {
      throw new Error(`Undefined page for current index ${newPage.currentPageCount}`)
    }

    templateInstance.collector.dispatchEvent(new Event('collect'))

    const $current = templateInstance.$('.lea-task-current-content-container')
    const currentHeight = $current.height()
    const oldContainerCss = $current.css('height') || ''
    $current.css('height', `${currentHeight}px`)

    templateInstance.state.set(newPage)

    setTimeout(() => {
      $current.css('height', oldContainerCss)
    }, 100)
  },
  'click .lea-task-finishstory-button' (event, templateInstance) {
    event.preventDefault()
    templateInstance.state.set('taskStory', null)
  },
  'click .lea-pagenav-finish-button' (event, templateInstance) {
    event.preventDefault()
    if (templateInstance.onFinish) {
      templateInstance.onFinish()
    }
  }
})
