import axios from 'axios'

const client = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
  credentials: 'include',
  headers: { 'Access-Control-Allow-Credentials': true }
})

export const request = ({ ...options }) => {
  const onSuccess = (response) => response
  const onError = (error) => {
    const {
      response: { data }
    } = error
    if (data.errorMessage) throw new Error(data.errorMessage)
    throw new Error('Something went wrong! Please try later!')
  }
  return client(options).then(onSuccess).catch(onError)
}
