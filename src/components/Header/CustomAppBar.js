import {
  Mail as MailIcon,
  AccountCircle,
  Menu as MenuIcon,
  GridView,
  LightMode,
  DarkMode
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { Avatar, Badge, Tooltip, useMediaQuery } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { useAuthProvider } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import React, { useCallback, useState } from 'react'
import { StyledLink } from '../../styled/styled'
import MobileMenu from '../MenuUI/MobileMenu'
import Notification from './Notification'
import { getCroppedImageUrl } from '../../utils/crop-url-utils'

const StyledRightWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flex: 6
}))

const StyledTypographyLink = styled(Link)(({ theme }) => ({
  color: 'inherit',
  textDecoration: 'none',
  flex: 1,
  paddingRight: theme.spacing(2),
  display: 'block',
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const CustomAppBar = ({ toggleDrawer }) => {
  const { toggleColorMode, theme } = useThemeProvider()
  const { currentUser, logout } = useAuthProvider()
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null)

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const userImageUrl = getCroppedImageUrl(
    currentUser?.photo,
    /(upload\/)(.*)/,
    '$1c_thumb,g_face,h_64,w_64/$2'
  )
  const handleCloseMobileMenu = useCallback(() => setMobileAnchorEl(null), [])

  const handleLogout = useCallback(() => {
    localStorage.setItem('manual-logout', true)
    logout()
  }, [])

  return (
    <AppBar
      position="relative"
      sx={{
        boxShadow: 'none',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'center',
            mr: 1
          }}
        >
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={toggleDrawer}
          >
            <GridView />
          </IconButton>
        </Box>
        <StyledTypographyLink to="/">
          <Typography
            variant="h6"
            component="div"
            sx={{ flex: 1, pr: 2, display: { xs: 'none', md: 'block' } }}
          >
            Dashboard
          </Typography>
        </StyledTypographyLink>
        <StyledRightWrapper>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              color="inherit"
              onClick={toggleColorMode}
              aria-label={
                theme.palette.mode === 'light'
                  ? 'Switch to dark mode'
                  : 'Switch to light mode'
              }
            >
              {theme.palette.mode === 'light' ? <DarkMode /> : <LightMode />}
            </IconButton>
            <Tooltip title="Do not have messages">
              <IconButton
                size="large"
                color="inherit"
                aria-label="Notifications (0)"
              >
                <Badge badgeContent={0} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Notification />
            <StyledLink
              to={`users/${currentUser._id}`}
              isDisabled={!currentUser?._id}
            >
              {currentUser?.photo ? (
                <Avatar
                  alt={currentUser.userName}
                  src={userImageUrl}
                  sx={{ ml: 1 }}
                />
              ) : (
                <IconButton
                  size="large"
                  edge="end"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              )}
            </StyledLink>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              onClick={(event) => setMobileAnchorEl(event.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </StyledRightWrapper>
        {isMobile && (
          <MobileMenu
            anchorEl={mobileAnchorEl}
            handleCloseMenu={handleCloseMobileMenu}
            currentUser={currentUser}
            handleLogout={handleLogout}
          />
        )}
      </Toolbar>
    </AppBar>
  )
}

export default React.memo(CustomAppBar)
