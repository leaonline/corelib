/* global AutoForm */

const defaultCleanOptions = {
  filter: true,
  autoConvert: true,
  removeEmptyStrings: true,
  trimStrings: true,
  getAutoValues: true,
  removeNullsFromArrays: true
}

/**
 * Reactively checks a form for input validity by a given schema.
 * Side-effect: adds sticky validation errors if form is not valid
 * @param formId
 * @param schema
 * @param isUpdate
 * @return {Object|null} form document if form is valid, otherwise null
 */
export const formIsValid = function formIsValid (formId, schema, { isUpdate, template, clean } = {}) {
  // xxx: in some rare cases on insert forms there is no return value from
  // AutoForm.getFormValues, so we trick the validation into using an empty doc
  const formValues = AutoForm.getFormValues(formId, template, schema) || { insertDoc: {}, updateDoc: {} }
  const formDoc = isUpdate
    ? formValues.updateDoc
    : formValues.insertDoc

  let options
  if (isUpdate) {
    options = {}
    options.modifier = true
    options.clean = Object.assign({}, clean, defaultCleanOptions)
  }

  const context = schema.newContext()
  context.validate(formDoc, options)

  const errors = context.validationErrors()
  if (errors && errors.length > 0) {
    console.log(errors)
    errors.forEach(err => AutoForm.addStickyValidationError(formId, err.key, err.type, err.value))
    return null
  }

  return formDoc
}

/**
 * Resets a form by id.
 * @param formId
 * @return {undefined}
 */
export const formReset = formId => AutoForm.resetForm(formId)
