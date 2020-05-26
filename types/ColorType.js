export const ColorType = {
  name: 'colorType',
  label: 'colorType.title',
  icon: 'palette',
  isType: true,
  representative: 'index',
  useHistory: false
}

ColorType.types = {
  primary: {
    index: 0,
    name: 'primary',
    label: 'colorType.primary',
    type: 'primary',
    icon: 'star',
  },
  secondary: {
    index: 1,
    name: 'secondary',
    label: 'colorType.secondary',
    type: 'secondary',
    icon: 'paragraph',
  },
  success: {
    index: 2,
    name: 'success',
    label: 'colorType.success',
    type: 'success',
    icon: 'check',
  },
  warning: {
    index: 3,
    name: 'warning',
    label: 'colorType.warning',
    type: 'warning',
    icon: 'exclamation',
  },
  danger: {
    index: 4,
    name: 'danger',
    label: 'colorType.danger',
    type: 'danger',
    icon: 'times',
  },
  info: {
    index: 5,
    name: 'info',
    label: 'colorType.info',
    type: 'info',
    icon: 'info-circle',
  },
  light: {
    index: 6,
    name: 'light',
    label: 'colorType.light',
    type: 'light',
    icon: 'sun',
  },
  dark: {
    index: 7,
    name: 'dark',
    label: 'colorType.dark',
    type: 'dark',
    icon: 'moon',
  },
}

ColorType.allowedValues = Object.values(ColorType.types).map(entry => entry[ColorType.representative])
