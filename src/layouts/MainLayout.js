import { CssBaseline, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header/Header'
import SideBar from '../components/Aside/SideBar'

const StyledContainer = styled('div')(() => ({
  width: '100%',
  display: 'flex'
}))

const MainLayout = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 'unset'
      }}
    >
      <CssBaseline enableColorScheme />
      <Header />
      <StyledContainer>
        <SideBar />
        <Outlet />
      </StyledContainer>
    </Paper>
  )
}

export default MainLayout
