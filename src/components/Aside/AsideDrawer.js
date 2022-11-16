import styled from '@emotion/styled'
import { Brightness5, BrightnessHigh } from '@mui/icons-material'
import {
  alpha,
  Box,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Tooltip
} from '@mui/material'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { getSideData } from '../../data/aside-data'
import { StyledLink } from '../../styled/styled'

const StyledFlexBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledStack = styled(Stack)(({ theme }) => ({
  width: '50px',
  alignItems: 'center',
  justifyContent: 'space-around',
  height: '100%',
  color: theme.palette.common.white,
  '@media (orientation: landscape)': {
    height: 'auto'
  },
  backgroundColor:
    theme.palette.mode === 'light'
      ? theme.palette.primary.dark
      : alpha(theme.palette.common.white, 0.15)
}))

const AsideDrawer = ({ isDrawerOpen, onDrawerClose }) => {
  const { toggleColorMode, theme } = useThemeProvider()
  const { currentUser } = useAuthProvider()

  function renderSideIonsContent() {
    return getSideData(currentUser?._id)
      .flatMap((data) => data.items)
      .map((item) => {
        if (item.label === 'Logout') return
        return (
          <StyledLink
            key={item.label}
            to={item.to ? item.to : '/'}
            state={{ data: item.label.toLowerCase() }}
            onClick={onDrawerClose}
          >
            <StyledFlexBox>
              <Tooltip title={item.label} enterTouchDelay={0}>
                <IconButton size="small" edge="end" color="inherit">
                  {item.icon}
                </IconButton>
              </Tooltip>
            </StyledFlexBox>
          </StyledLink>
        )
      })
  }

  return (
    <Drawer anchor="left" open={isDrawerOpen} onClose={onDrawerClose}>
      <>
        <Toolbar />
        <StyledStack>
          {renderSideIonsContent()}
          <StyledFlexBox>
            <Tooltip
              title={
                theme.palette.mode === 'light' ? 'Dark mode' : 'Light mode'
              }
              enterTouchDelay={0}
            >
              <IconButton
                size="small"
                color="inherit"
                onClick={toggleColorMode}
              >
                {theme.palette.mode === 'light' ? (
                  <Brightness5 />
                ) : (
                  <BrightnessHigh />
                )}
              </IconButton>
            </Tooltip>
          </StyledFlexBox>
        </StyledStack>
      </>
    </Drawer>
  )
}

export default AsideDrawer
