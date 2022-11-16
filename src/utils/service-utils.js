import { CLOUD_API } from '../data/data'
import { request } from './axios-utils'

export const createAccount = async (user) => {
  return await request({ url: '/auth/register', method: 'POST', data: user })
}

export const loginToAccount = async (user) => {
  return await request({ url: '/auth/login', method: 'POST', data: user })
}

export const checkAuthToken = async (userId, token) => {
  return await request({ url: `/auth/${userId}/verify/${token}` })
}

export const changeUser = async ({ userId, changedData }) => {
  return await request({
    url: `/users/${userId}`,
    method: 'PUT',
    data: changedData
  })
}

export const fetchUser = async ({ queryKey }) => {
  const userId = queryKey[1]
  return await request({ url: `/users/${userId}` })
}

export const createUser = async (user) => {
  return await request({ url: '/users', method: 'POST', data: user })
}

export const deleteUser = async (userId) => {
  return await request({ url: `/users/${userId}`, method: 'DELETE' })
}

export const fetchAllUsers = async () => {
  return await request({ url: '/users' })
}

export const fetchAllRooms = async () => {
  return await request({ url: '/rooms' })
}

export const deleteRoom = async (roomId) => {
  return await request({ url: `/rooms/${roomId}`, method: 'DELETE' })
}

export const createRoom = async ({ room, hotelId }) => {
  return await request({ url: `/rooms/${hotelId}`, method: 'POST', data: room })
}

export const changeUnavailableDates = async ({ roomId, dates }) => {
  return await request({
    url: `/rooms/availability/${roomId}`,
    method: 'PUT',
    data: { dates }
  })
}

export const changeRoom = async ({ roomId, changedData }) => {
  return await request({
    url: `/rooms/change/${roomId}`,
    method: 'PUT',
    data: changedData
  })
}

export const clearUnavailableDates = async ({ roomId, dates }) => {
  return await request({
    url: `/rooms/clear/${roomId}`,
    method: 'PUT',
    data: { dates }
  })
}

export const removeDeprecatedDates = async ({ roomId, operation }) => {
  return await request({
    url: `/rooms/remove/${roomId}`,
    method: 'PUT',
    data: { operation }
  })
}

export const fetchRoom = async (roomId) => {
  return await request({ url: `/rooms/${roomId}` })
}

export const createOrder = async (order) => {
  return await request({ url: `/orders`, method: 'POST', data: order })
}

export const changeOrder = async ({ orderId, changedData }) => {
  return await request({
    url: `/orders/${orderId}`,
    method: 'PUT',
    data: changedData
  })
}

export const fetchAllOrders = async () => {
  return await request({ url: '/orders' })
}

export const fetchOrder = async ({ queryKey }) => {
  const orderId = queryKey[1]
  return await request({ url: `/orders/find/${orderId}` })
}

export const deleteOrder = async (orderId) => {
  return await request({ url: `/orders/${orderId}`, method: 'DELETE' })
}

export const fetchTransactions = async (params) => {
  const resParams = setSearchParams(params)
  return await request({ url: `/orders${resParams}` })
}

export const fetchAllHotels = async () => {
  return await request({ url: `/hotels` })
}

export const createHotel = async (data) => {
  return await request({ url: `/hotels`, method: 'POST', data })
}

export const fetchFlats = async ({ queryKey }) => {
  const hotelId = queryKey[1]
  return await request({ url: `/hotels/room/${hotelId}` })
}

export const changeHotel = async ({ hotelId, changedData }) => {
  return await request({
    url: `/hotels/${hotelId}`,
    method: 'PUT',
    data: changedData
  })
}

export const fetchHotel = async ({ queryKey }) => {
  const hotelId = queryKey[1]
  return await request({ url: `/hotels/find/${hotelId}` })
}

export const deleteHotel = async (hotelId) => {
  return await request({ url: `/hotels/${hotelId}`, method: 'DELETE' })
}

export const fetchProperties = async () => {
  return await request({ url: `/hotels/properties` })
}

export const fetchAllCities = async () => {
  return await request({ url: `/hotels/cities` })
}

export const fetchHouses = async (params) => {
  const resParams = setSearchParams(params)
  return await request({ url: `/hotels${resParams}` })
}

export const countWidgets = async () => {
  return await request({ url: `/stats/widgets` })
}

export const fetchMonthSales = async (params) => {
  const resParams = setSearchParams(params) || ''
  return await request({ url: `/stats/sales/months${resParams}` })
}

export const fetchTodaySales = async () => {
  return await request({ url: `/stats/sales/today` })
}

export const fetchRoomFrequently = async (roomId) => {
  return await request({ url: `/stats/frequently/room/${roomId}` })
}

export const fetchAllNotifications = async (params) => {
  const resParams = setSearchParams(params) || ''
  return await request({ url: `/notifications${resParams}` })
}

export const deleteAllNotifications = async () => {
  return await request({ url: '/notifications', method: 'DELETE' })
}

export const uploadImage = async (data) => {
  return await request({ url: CLOUD_API, method: 'POST', data })
}

function setSearchParams(params) {
  const searchParams = _getSearchParams(params?.queryKey[1])
  return params.pageParam
    ? `${searchParams}&page=${params.pageParam}`
    : searchParams
}

function _getSearchParams(obj) {
  if (!obj) return
  const res = Object.entries(obj)
    .filter(([_key, value]) => !!value)
    .reduce((prev, [key, value], i) => {
      prev += i === 0 ? `?${key}=${value}` : `&${key}=${value}`
      return prev
    }, '')
  return res
}
