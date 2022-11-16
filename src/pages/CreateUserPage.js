import { MainContainer } from './HomePage'
import styled from '@emotion/styled'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, Grid, Stack } from '@mui/material'
import CustomSubmitButton from '../components/FormsUI/CustomSubmitButton'
import { createUserVariants } from '../data/inputs-data'
import CustomFileField from '../components/FormsUI/CustomFileField'
import { validateImageFormat } from '../utils/validate-utils'
import { renderInputsContent } from '../utils/render-inputs-utils'
import { capitalizedString } from '../utils/capitalized-string-utils'
import { changeUser, createUser } from '../utils/service-utils'
import { useSnackbar } from 'notistack'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { sendImageToCloud } from '../utils/upload-image-utils'
import {
  convertBoolToVariant,
  convertVariantToBool
} from '../utils/convert-variant-utils'
import { StyledCreateCardContent, StyledForm } from '../styled/styled'

const initialValues = {
  name: '',
  email: '',
  userName: '',
  lastName: '',
  userImage: [],
  password: '',
  hasNewsletter: 'no',
  isVerified: 'no',
  isAdmin: 'no'
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Required field')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
  lastName: Yup.string()
    .required('Required field')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
  userName: Yup.string().required('Required field'),
  hasNewsletter: Yup.string().required('Required field'),
  isAdmin: Yup.string().required('Required field'),
  email: Yup.string().required('Required field').email('Invalid email format'),
  password: Yup.string().required('Required field'),
  userImage: Yup.array().of(
    Yup.mixed().test('fileFormat', 'Unsupported Format', validateImageFormat)
  )
})

const CreateUserPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { mutateAsync: mutateCreateAsync } = useMutation(createUser)
  const { mutateAsync: mutateChangeAsync } = useMutation(changeUser)
  const { enqueueSnackbar } = useSnackbar()
  const userProfileData = useMemo(
    () => parseUserData(location.state?.data),
    [location.key]
  )
  const pageTitle = userProfileData ? 'Update User' : 'Add New Users'
  const inputVariants = useMemo(
    () =>
      userProfileData ? disablePasswordFromVariants() : createUserVariants,
    []
  )

  function createUserData(value) {
    const {
      hasNewsletter,
      isAdmin,
      isVerified,
      name,
      lastName,
      userImage,
      ...rest
    } = value
    return {
      hasNewsletter: convertVariantToBool(hasNewsletter),
      isAdmin: convertVariantToBool(isAdmin),
      isVerified: convertVariantToBool(isVerified),
      name: capitalizedString(name),
      lastName: capitalizedString(lastName),
      photo: userImage?.[0],
      ...rest
    }
  }

  function parseUserData(data) {
    if (!data) return
    const dummyPassword = '121212'
    const user = JSON.parse(data)
    return {
      name: user.name,
      email: user.email.toLowerCase(),
      userName: user.userName.toLowerCase(),
      lastName: user.lastName,
      userImage: [user.photo],
      password: dummyPassword,
      hasNewsletter: convertBoolToVariant(user.hasNewsletter),
      isVerified: convertBoolToVariant(user.isVerified),
      isAdmin: convertBoolToVariant(user.isAdmin),
      userId: user.userId
    }
  }

  function onSuccess(res, resetForm) {
    enqueueSnackbar(res.data, {
      variant: 'success'
    })
    resetForm()
  }

  function disablePasswordFromVariants() {
    return createUserVariants.map((variant) =>
      variant.id === 'password' ? { ...variant, disabled: true } : variant
    )
  }

  async function handleChangeSubmit(value, { resetForm }) {
    const { password, userId, ...user } = createUserData(value)

    try {
      if (userProfileData && user.photo === userProfileData.userImage[0]) {
      } else {
        if (user.photo) {
          const imageUrl = await sendImageToCloud(user.photo)
          user.photo = imageUrl
        }
      }

      const res = await mutateChangeAsync({
        userId,
        changedData: user
      })
      onSuccess(res, resetForm)
      navigate(-1)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  async function handleCreateSubmit(value, { resetForm }) {
    const user = createUserData(value)
    try {
      if (user.photo) {
        const imageUrl = await sendImageToCloud(user.photo)
        user.photo = imageUrl
      }
      const res = await mutateCreateAsync(user)
      onSuccess(res, resetForm)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  return (
    <MainContainer>
      <Card sx={{ p: 2, mt: 3 }}>
        <CardHeader
          title={pageTitle}
          titleTypographyProps={{
            color: 'text.secondary'
          }}
          sx={{ p: 0 }}
          color={'text.secondary'}
        />
        <StyledCreateCardContent component="div">
          <Formik
            initialValues={userProfileData ? userProfileData : initialValues}
            validationSchema={validationSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={userProfileData ? handleChangeSubmit : handleCreateSubmit}
          >
            {({ isSubmitting }) => (
              <StyledForm>
                <Grid container spacing={2}>
                  <Grid
                    xs={12}
                    sm={12}
                    md={4}
                    item
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Stack
                      spacing={2}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CustomFileField name="userImage" id="userImage" />
                    </Stack>
                  </Grid>
                  <Grid xs={12} sm={12} md={8} item container spacing={4}>
                    {renderInputsContent(inputVariants)}
                  </Grid>
                </Grid>
                <CustomSubmitButton
                  sx={{ mt: 4, width: { xs: '100%', md: '20%' } }}
                  withLoading
                  loading={isSubmitting}
                >
                  Save
                </CustomSubmitButton>
              </StyledForm>
            )}
          </Formik>
        </StyledCreateCardContent>
      </Card>
    </MainContainer>
  )
}

export default CreateUserPage
