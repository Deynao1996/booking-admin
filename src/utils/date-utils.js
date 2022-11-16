export function addWeeks(weeks, date = new Date()) {
  date.setDate(date.getDate() + weeks * 7)

  return date
}

export function dateToString(date) {
  return new Date(date).toLocaleDateString()
}

export function getDateWithoutTime(dateParam) {
  const date = new Date(dateParam.getTime())
  date.setHours(0, 0, 0, 0)
  return date
}

export function getDatesInRange(startDate, endDate) {
  const end = getDateWithoutTime(endDate)
  const date = getDateWithoutTime(startDate)
  const dates = []

  while (date <= end) {
    dates.push(new Date(date).getTime())
    date.setDate(date.getDate() + 1)
  }

  return dates
}
