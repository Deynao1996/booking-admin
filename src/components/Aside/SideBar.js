import styled from '@emotion/styled'
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from '@mui/material'
import { Stack } from '@mui/system'
import { useAuthProvider } from '../../contexts/AuthContext'
import { getSideData } from '../../data/aside-data'
import { StyledLink } from '../../styled/styled'

const StyledListItemIcon = styled(ListItemIcon)(({ theme, isDisabled }) => ({
  '&.MuiListItemIcon-root': {
    color: theme.palette.primary.main,
    '& > svg': {
      fontSize: 16
    }
  }
}))

const SideBar = () => {
  const { logout, currentUser } = useAuthProvider()
  const sideData = getSideData(currentUser?._id)

  function handleLogOut(e) {
    e.preventDefault()
    localStorage.setItem('manual-logout', true)
    logout()
  }

  function renderListContent(data) {
    return data.map((label, i) => (
      <List
        disablePadding
        component="nav"
        key={i}
        subheader={
          <ListSubheader
            component="div"
            sx={{ lineHeight: 'normal', p: 1, fontSize: 12 }}
          >
            {label.title}
          </ListSubheader>
        }
      >
        {renderListItemContent(label.items)}
      </List>
    ))
  }

  function renderListItemContent(arr) {
    return arr.map((item, i) => (
      <StyledLink
        key={i}
        to={item.to ? item.to : '/'}
        state={{ data: item.label.toLowerCase() }}
        onClick={item.label === 'Logout' ? handleLogOut : () => ({})}
        isDisabled={!currentUser?._id}
      >
        <ListItemButton>
          <StyledListItemIcon>{item.icon}</StyledListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
          />
        </ListItemButton>
      </StyledLink>
    ))
  }

  return (
    <Stack sx={{ flex: 1, display: { xs: 'none', lg: 'block' } }}>
      {renderListContent(sideData)}
    </Stack>
  )
}

export default SideBar
