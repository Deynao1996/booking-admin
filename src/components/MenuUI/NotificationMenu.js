import {
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Skeleton,
  Typography
} from '@mui/material'
import React, { useMemo } from 'react'
import { StyledLink } from '../../styled/styled'
import { deleteAllNotifications, fetchUser } from '../../utils/service-utils'
import { useHandleError } from '../../hooks/useHandleError'
import { stringAvatar } from '../../utils/avatar-utils'
import { useQueries } from '@tanstack/react-query'
import { formatDistance } from 'date-fns'
import { BookmarkAdded } from '@mui/icons-material'
import { useRemoveNotifications } from '../../hooks/useRemoveNotifications'

export const getFullName = (user) => {
  return user.lastName === 'Not provide' && user.name === 'Not provide'
    ? user.userName
    : `${user.lastName} ${user.name}`
}

const ITEM_HEIGHT = 62

const NotificationMenu = ({ anchorEl, handleCloseMenu, notifications }) => {
  const uniqueNotifications = useMemo(
    () => setUniqueNotifications(),
    [notifications]
  )
  const { deleteNotifications } = useRemoveNotifications({
    mutationFunc: deleteAllNotifications,
    label: 'notifications'
  })
  const result = useQueries({
    queries: uniqueNotifications
      ? uniqueNotifications.map((userId) => {
          return {
            enabled: !!uniqueNotifications.length && !!anchorEl,
            queryKey: [`$user:${userId}`, userId],
            queryFn: fetchUser
          }
        })
      : []
  })
  const isLoading = result.some((res) => res.isLoading)
  const isError = result.some((res) => res.isError)
  const error = result.map((res) => res.error)
  const data = useMemo(
    () => (!isLoading ? getTransformedData(result) : []),
    [isLoading, result]
  )
  useHandleError(isError, error?.[0])

  function setUniqueNotifications() {
    return [...new Set(notifications?.map((not) => not.userId))] || []
  }

  function setAvailableNotifications(result) {
    return result.map((data) => {
      if (!data?.data.data) return

      const photo = data.data.data.photo
      const userId = data.data.data._id
      const fullName = getFullName(data.data.data)
      return {
        photo,
        userId,
        fullName
      }
    })
  }

  function getTransformedData(result) {
    if (!result.length) return []
    const isDataExist = result.some((res) => res.data)
    if (!isDataExist) return []
    const transformedResult = setAvailableNotifications(result)
    return transformedResult
  }

  function setNotificationText(type, userName) {
    switch (type) {
      case 'new-order':
        return `${userName} placed an order`
      case 'new-user':
        return `${userName} created an account`
      default:
        return ''
    }
  }

  function handleDelete() {
    deleteNotifications()
    handleCloseMenu()
  }

  function renderNotifications() {
    if (isLoading || !notifications)
      return Array.from(Array(notifications.length), (_, i) => (
        <CustomSkeleton key={i} />
      ))

    return notifications.map((not, i) => {
      const user = data?.find((item) => item?.userId === not.userId)
      if (!user) return

      const { userId, photo, fullName } = user
      const text = setNotificationText(not.type, fullName)
      const linkPath = not.metaId ? `/orders/${not.metaId}` : `/users/${userId}`
      const timeAgo = formatDistance(new Date(not.createdAt), new Date(), {
        addSuffix: true
      })

      return (
        <MenuItem key={i}>
          <StyledLink
            to={linkPath}
            onClick={handleCloseMenu}
            sx={{ display: 'flex' }}
          >
            <Avatar
              alt={fullName}
              src={photo}
              {...stringAvatar(fullName)}
              sx={{ mr: 1 }}
            />
            <div>
              <Typography component="div">{text}</Typography>
              <Typography component="div" variant="caption">
                {timeAgo}
              </Typography>
            </div>
          </StyledLink>
        </MenuItem>
      )
    })
  }

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      PaperProps={{
        style: {
          maxHeight: ITEM_HEIGHT * 4.5
        }
      }}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      <MenuList dense>
        {renderNotifications()}
        <Divider />
        <MenuItem sx={{ mt: 2 }} onClick={handleDelete}>
          <ListItemIcon>
            <BookmarkAdded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as read</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

const CustomSkeleton = () => {
  return (
    <MenuItem>
      <Skeleton
        animation="wave"
        variant="circular"
        sx={{
          width: 40,
          height: 40,
          mr: 1
        }}
      />
      <Skeleton
        animation="wave"
        variant="rounded"
        sx={{
          width: '200px',
          height: '15px'
        }}
      />
    </MenuItem>
  )
}

export default NotificationMenu
