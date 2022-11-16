import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { StyledLink } from '../styled/styled'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: 'primary',
        marginTop: 10
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6" align="center">
        The page you’re looking for doesn’t exist.
      </Typography>
      <StyledLink
        to="/"
        color="inherit"
        sx={{ textDecoration: 'underline', my: 2 }}
      >
        Back Home
      </StyledLink>
      <Typography
        onClick={() => navigate(-1)}
        color="inherit"
        sx={{ textDecoration: 'underline' }}
      >
        Back To Previous Page
      </Typography>
    </Box>
  )
}

export default ErrorPage
