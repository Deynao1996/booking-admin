export const convertVariantToBool = (str) => {
  switch (str) {
    case 'yes':
      return true
    case 'no':
      return false
    default:
      return false
  }
}

export const convertBoolToVariant = (bool) => {
  switch (bool) {
    case true:
      return 'yes'
    case false:
      return 'no'
    default:
      return 'no'
  }
}
