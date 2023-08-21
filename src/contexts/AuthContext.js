import axios from 'axios'
import { useSnackbar } from 'notistack'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { request } from '../utils/axios-utils'
import { io } from 'socket.io-client'

const AuthContext = React.createContext()

export const useAuthProvider = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user-info'))
  )
  const navigate = useNavigate()
  const socketRef = useRef()

  function emitNewAdmin(adminId) {
    socketRef.current?.emit('new-admin', adminId)
  }

  function handleDisconnect() {
    socketRef.current?.emit('handle-disconnect')
  }

  const saveCurrentUser = (res) => {
    if (!res.data) return
    emitNewAdmin(res.data._id)
    saveUserToStorage(res.data)
    setCurrentUser(res.data)
  }

  function saveUserToStorage(user) {
    const { userName, photo } = user
    localStorage.setItem('user-info', JSON.stringify({ userName, photo }))
  }

  function logout() {
    navigate('/login')
    setCurrentUser(false)
    handleDisconnect()
    localStorage.removeItem('user-info')
    request({ url: '/auth/logout' })
  }

  function login(user, redirectPath) {
    localStorage.removeItem('manual-logout')
    emitNewAdmin(user._id)
    saveUserToStorage(user)
    setCurrentUser(user)
    redirectPath && navigate(redirectPath)
  }

  function handleError(e) {
    const errorMessage = e.response.data.errorMessage || e.response.message
    if (e.response?.status === 401 || e.response?.status === 403) logout()
    enqueueSnackbar(errorMessage, { variant: 'error' })
    localStorage.setItem('manual-logout', true)
  }

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      socketRef.current = io('http://localhost:5000')
      return () => {
        socketRef.current?.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    if (!localStorage.getItem('manual-logout')) {
      const axiosCfg = {
        url: `${process.env.REACT_APP_API}/auth/login/with-jwt`,
        method: 'get',
        withCredentials: true,
        credentials: 'include',
        headers: { 'Access-Control-Allow-Credentials': true }
      }
      axios(axiosCfg).then(saveCurrentUser).catch(handleError)
    }
  }, [])

  const value = {
    currentUser,
    login,
    logout,
    socketRef
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
