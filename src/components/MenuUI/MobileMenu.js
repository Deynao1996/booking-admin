import { Logout, MailOutline, PermIdentity } from '@mui/icons-material'
import { Badge, IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { StyledLink } from '../../styled/styled'
import Notification from '../Header/Notification'

const MobileMenu = ({
  anchorEl,
  handleCloseMenu,
  currentUser,
  handleLogout
}) => {
  const location = useLocation()

  useEffect(() => handleCloseMenu(), [location])

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      <StyledLink
        to={`users/${currentUser._id}`}
        onClick={handleCloseMenu}
        isDisabled={!currentUser?._id}
      >
        <MenuItem>
          <IconButton size="large" color="inherit">
            <PermIdentity />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </StyledLink>
      <MenuItem onClick={handleLogout}>
        <IconButton size="large" color="inherit">
          <Logout />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
      <MenuItem>
        <Notification isMobile />
      </MenuItem>
      <MenuItem>
        <Tooltip title="Do not have messages" enterTouchDelay={0}>
          <Box sx={{ display: 'flex' }}>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={0} color="error">
                <MailOutline />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </Box>
        </Tooltip>
      </MenuItem>
    </Menu>
  )
}

export default React.memo(MobileMenu)
