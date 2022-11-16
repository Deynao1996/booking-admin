import Box from '@mui/material/Box'
import SignIn from '../components/SignIn'

const LoginPage = () => {
  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <SignIn />
    </Box>
  )
}

export default LoginPage
