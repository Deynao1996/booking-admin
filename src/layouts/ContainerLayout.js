import { Container, CssBaseline, Link, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" component="span">
        Dashboard
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const ContainerLayout = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 'unset',
        width: '100%'
      }}
    >
      <CssBaseline enableColorScheme />
      <Container component="main" maxWidth="xs">
        <Outlet />
        <Copyright sx={{ mt: 4, mb: 4 }} />
      </Container>
    </Paper>
  )
}

export default ContainerLayout
