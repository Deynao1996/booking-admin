import { addWeeks } from '../utils/date-utils'

export const today = new Date()
today.setHours(0, 0, 0, 0)

export const currentMonth = new Date().getMonth() + 1

export const endRangeDate = addWeeks(2)

export const uploadImageFormats = [
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/png'
]

export const CLOUD_API =
  'https://api.cloudinary.com/v1_1/dkl9cqqui/image/upload'

export const DAILY_TARGET_SALES = 10000
