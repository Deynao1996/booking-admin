import { uploadImageFormats } from '../data/data'
import { dateToString } from './date-utils'
import _isObject from 'lodash/isObject'

export const validatePositiveNumber = (label) =>
  `${label} should be more than 0`

export const validateMinDate = (min, label) =>
  `${label} date should be greater than ${dateToString(min)}`

export const validateMaxDate = (max, label) =>
  `${label} date should be not greater than ${dateToString(max)}`

export const validateMaxNumber = (max, label) =>
  `${label} must be less than ${max} $`

export const validateMinNumber = (max, label) =>
  `${label} date should be not greater than ${dateToString(max)}`

export const validateComparisonDates = (started, yup) => {
  if (started) {
    const dayAfter = new Date(started.getTime() + 86400000)
    return yup.min(dayAfter, () => validateMinDate(started, 'Departure'))
  }
}

export const validateImageFormat = (value) => {
  if (_isObject(value)) return value && uploadImageFormats.includes(value.type)
  return true
}
