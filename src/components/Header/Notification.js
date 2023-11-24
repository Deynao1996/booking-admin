import { Notifications } from '@mui/icons-material'
import { Badge, Box, IconButton, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect, useId, useState } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useHandleError } from '../../hooks/useHandleError'
import { fetchAllNotifications } from '../../utils/service-utils'
import NotificationMenu from '../MenuUI/NotificationMenu'

const Notification = ({ isMobile }) => {
  const { currentUser, socketRef } = useAuthProvider()
  const [notifications, setNotifications] = useState(null)
  const { data, isError, error } = useQuery(
    ['notifications'],
    fetchAllNotifications,
    {
      enabled: !!currentUser?._id
    }
  )
  useHandleError(isError, error)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const notificationsLength = notifications?.length
  const handleCloseNotificationMenu = useCallback(
    () => setNotificationAnchorEl(null),
    [setNotificationAnchorEl]
  )

  function handleClick(e) {
    notificationsLength && setNotificationAnchorEl(e.currentTarget)
  }

  useEffect(() => {
    setNotifications(data?.data.notifications)
  }, [data])

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      socketRef.current?.on('get-notification', (data) => {
        const date = new Date()
        const _id = date.getTime()
        setNotifications((prev) => [{ ...data, _id, createdAt: date }, ...prev])
      })
      return () => {
        socketRef.current?.off('get-notification')
      }
    }
  }, [socketRef.current])

  return (
    <>
      <Tooltip title={!notificationsLength && 'Do not have notifications'}>
        <Box sx={{ display: 'flex' }} onClick={handleClick}>
          <IconButton
            size="large"
            color="inherit"
            aria-label={`Notifications (${notificationsLength})`}
          >
            <Badge badgeContent={notificationsLength} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          {isMobile && <p>Notifications</p>}
        </Box>
      </Tooltip>
      {!!notificationsLength && (
        <NotificationMenu
          anchorEl={notificationAnchorEl}
          handleCloseMenu={handleCloseNotificationMenu}
          notifications={notifications}
        />
      )}
    </>
  )
}

export default React.memo(Notification)
