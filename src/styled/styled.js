import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { Avatar, CardContent } from '@mui/material'
import { Form } from 'formik'

export const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isDisabled'
})(({ isDisabled }) => ({
  pointerEvents: isDisabled ? 'none' : 'auto',
  color: 'inherit',
  textDecoration: 'none'
}))

export const StyledCreateCardContent = styled(CardContent)(({ theme }) => ({
  padding: 0,
  marginTop: theme.spacing(3)
}))

export const StyledForm = styled(Form)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}))

export const StyledBox = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1)
}))

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  [theme.breakpoints.down('lg')]: {
    width: 200,
    height: 200
  },
  [theme.breakpoints.down('sm')]: {
    width: 100,
    height: 100
  }
}))

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-around',
  gap: theme.spacing(3),
  marginTop: theme.spacing(2)
}))
