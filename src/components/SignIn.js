import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import CustomTextField from './FormsUI/CustomTextField'
import CustomSubmitButton from './FormsUI/CustomSubmitButton'
import styled from '@emotion/styled'
import { loginToAccount } from '../utils/service-utils'
import { useAuthProvider } from '../contexts/AuthContext'
import { useSnackbar } from 'notistack'

const initialValues = {
  userName: '',
  password: ''
}

const validationSchema = Yup.object({
  userName: Yup.string().required('Required field'),
  password: Yup.string().required('Required field')
})

const StyledForm = styled(Form)(({ theme }) => ({
  marginTop: theme.spacing(1)
}))

const SignIn = () => {
  const { login } = useAuthProvider()
  const { enqueueSnackbar } = useSnackbar()

  async function handleSubmit({ userName, password }) {
    try {
      const user = { userName: userName.toLowerCase(), password }
      const res = await loginToAccount(user)

      if (res.data.isAdmin) {
        const { _id, email, userName, hasNewsletter, photo, ...rest } = res.data
        login({ _id, email, userName, hasNewsletter, photo }, '/')
      } else {
        enqueueSnackbar('You are not allowed to login!', { variant: 'error' })
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <CustomTextField
              id="userName"
              label="User Name"
              name="userName"
              autoFocus
              autoComplete="username"
              required={true}
            />
            <CustomTextField
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              required={true}
            />
            <CustomSubmitButton
              margin="normal"
              disabled={isSubmitting}
              type="submit"
            >
              Sign In
            </CustomSubmitButton>
          </StyledForm>
        )}
      </Formik>
    </>
  )
}

export default SignIn
