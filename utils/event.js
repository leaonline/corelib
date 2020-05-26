/**
 * Returns a data attribute of a event target. Default name is 'target'
 * @param event a Template instance's current dispatched event
 * @param templateInstance the current Template instance
 * @param dataAttribute name of the data-* attribute
 * @return {String|undefined} the content stored in the data-* attribute
 */
export const dataTarget = (event, templateInstance, dataAttribute = 'target') => templateInstance.$(event.currentTarget).data(dataAttribute)
