/**
 * Definitions for extended schema options that can be defined by contexts
 * in order to be a valid consumable resource for the backend application.
 */
export const SchemaOptions = {
  unique: Boolean,
  list: Boolean,

  /**
   * Defines, whether the given field contains a richtext, that can be styled.
   */
  richText: Boolean,

  /**
   * Defines, whether a field represents an url that is used to load a media
   * resource.
   */
  isMediaUrl: Boolean,

  /**
   * Defines a dependency to an external document (located in the given
   * collection), represented by a given field(-name).
   */
  dependency: {
    collection: String,
    field: String
  },

  /**
   * Defines a computed value by a given input and a given processing method.
   */
  value: {
    method: String,
    input: Array
  },

  /**
   * Support aldeed:autoform
   */
  autoform: Object,

  /**
   * a fixed set of options
   */
  options: Array,

  /**
   * grouping properties
   */
  group: String,

  /**
   * Indicates, that this field contains dynamically rendered content, that
   * is assigned via editor and follows a custom schema.
   */
  isPageContent: Boolean,

  /**
   * Indicates, that the defined Array type is sortable in it's order.
   */
  isSortable: Boolean
}
