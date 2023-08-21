import { MainContainer } from './HomePage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Card, CardHeader, Grid, Stack, Typography } from '@mui/material'
import CustomSubmitButton from '../components/FormsUI/CustomSubmitButton'
import { createHotelVariants } from '../data/inputs-data'
import {
  validateImageFormat,
  validatePositiveNumber
} from '../utils/validate-utils'
import CustomFileField from '../components/FormsUI/CustomFileField'
import { changeHotel, createHotel } from '../utils/service-utils'
import { renderInputsContent } from '../utils/render-inputs-utils'
import { useSnackbar } from 'notistack'
import { useMutation } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { capitalizedString } from '../utils/capitalized-string-utils'
import _isString from 'lodash/isString'
import { sendImageToCloud } from '../utils/upload-image-utils'
import { StyledCreateCardContent, StyledForm } from '../styled/styled'

const initialValues = {
  hotelName: '',
  address: '',
  distance: '',
  hotelPrice: 1,
  hotelTitle: '',
  hotelCity: '',
  subDescription: '',
  rating: 0,
  type: 'hotel',
  hotelDescription: '',
  features: '',
  hotelImages: [],
  cityImage: []
}

const validationSchema = Yup.object({
  hotelName: Yup.string().required('Required field'),
  address: Yup.string().required('Required field'),
  distance: Yup.string()
    .required('Required field')
    .matches(/^\d+$/, 'Only digits are allowed for this field'),
  hotelPrice: Yup.number()
    .positive(validatePositiveNumber('Hotel Price'))
    .max(100000, 'Must be less than 100000')
    .required('Required field'),
  hotelTitle: Yup.string().required('Required field'),
  hotelCity: Yup.string().required('Required field'),
  subDescription: Yup.string().required('Required field'),
  rating: Yup.number()
    .typeError('Rating should be a number')
    .min(0, 'Must be more than 0')
    .max(10, 'Must be less than 10')
    .required('Required field'),
  type: Yup.string().required('Required field'),
  hotelDescription: Yup.string().required('Required field'),
  hotelImages: Yup.array()
    .min(4, 'Minimum 4 photos are required')
    .of(
      Yup.mixed().test('fileFormat', 'Unsupported Format', validateImageFormat)
    ),
  cityImage: Yup.array()
    .min(1, 'City Image is required')
    .of(
      Yup.mixed().test('fileFormat', 'Unsupported Format', validateImageFormat)
    )
})

const CreateHotelPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const navigate = useNavigate()
  const { mutateAsync: mutateCreateAsync } = useMutation(createHotel)
  const { mutateAsync: mutateChangeAsync } = useMutation(changeHotel)
  const [isLoading, setIsLoading] = useState(false)
  const hotelData = useMemo(
    () => parseHotelData(location.state?.data),
    [location.key]
  )
  const pageTitle = hotelData ? 'Update Hotel' : 'Create New Hotels'

  function parseHotelData(data) {
    if (!data) return
    const hotel = JSON.parse(data)
    return {
      hotelName: hotel.name,
      address: hotel.address,
      distance: hotel.distance,
      hotelPrice: hotel.cheapestPrice,
      hotelTitle: hotel.title,
      hotelCity: capitalizedString(hotel.city),
      subDescription: hotel.subDescription,
      rating: hotel.rating,
      type: hotel.type,
      hotelDescription: hotel.description,
      features: hotel.features,
      hotelImages: hotel.photos,
      cityImage: [hotel.cityImg],
      hotelId: hotel._id
    }
  }

  function createHotelData(value) {
    const isFeatures = !!value.features

    return {
      name: value.hotelName,
      type: value.type,
      city: value.hotelCity.toLowerCase(),
      address: value.address,
      distance: value.distance,
      description: value.hotelDescription,
      subDescription: value.subDescription,
      rating: value.rating,
      rooms: [],
      title: value.hotelTitle,
      cheapestPrice: value.hotelPrice,
      features: isFeatures ? value.features : '',
      featured: isFeatures
    }
  }

  function handleMutate(hotel, hotelImageUrls, uploadedCityUrl) {
    return mutateCreateAsync({
      ...hotel,
      cityImg: uploadedCityUrl,
      photos: hotelImageUrls
    })
  }

  function onSuccess(res, resetForm) {
    enqueueSnackbar(res.data, {
      variant: 'success'
    })
    resetForm()
  }

  function onError(e) {
    enqueueSnackbar(e.message, { variant: 'error' })
  }

  async function uploadMultipleFiles(files) {
    const newImageFiles = files.filter((file) => !_isString(file))
    if (!newImageFiles.length) return []
    const promises = newImageFiles.map(
      async (image) => await sendImageToCloud(image)
    )
    const images = await Promise.all(promises)
    return images
  }

  async function handleCreateSubmit(value, { resetForm }) {
    const hotel = createHotelData(value)
    setIsLoading(true)
    try {
      const uploadedCityUrl = await sendImageToCloud(value.cityImage[0])
      const promises = value.hotelImages.map(
        async (image) => await sendImageToCloud(image)
      )
      Promise.all(promises)
        .then((hotelImageUrls) =>
          handleMutate(hotel, hotelImageUrls, uploadedCityUrl)
        )
        .then((res) => onSuccess(res, resetForm))
        .catch((e) => onError(e))
        .finally(() => setIsLoading(false))
    } catch (e) {
      enqueueSnackbar('Something went wrong!', { variant: 'error' })
    }
  }

  async function handleChangeSubmit(value, { resetForm }) {
    const { rooms, ...hotel } = createHotelData(value)
    const hotelId = value.hotelId
    let uploadedCityUrl = hotelData.cityImage[0]
    let hotelImages = value.hotelImages.filter((img) => _isString(img))
    setIsLoading(true)

    try {
      const uploadedImages = await uploadMultipleFiles(value.hotelImages)
      hotelImages = [...hotelImages, ...uploadedImages]

      if (value.cityImage[0] !== uploadedCityUrl) {
        uploadedCityUrl = await sendImageToCloud(value.cityImage[0])
      }
      const newHotel = {
        hotelId,
        changedData: {
          ...hotel,
          photos: hotelImages,
          cityImg: uploadedCityUrl
        }
      }
      const res = await mutateChangeAsync(newHotel)
      onSuccess(res, resetForm)
      navigate(-1)
    } catch (e) {
      enqueueSnackbar(e.message || 'Something went wrong!', {
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
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
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={validationSchema}
            onSubmit={hotelData ? handleChangeSubmit : handleCreateSubmit}
            initialValues={hotelData ? hotelData : initialValues}
          >
            <StyledForm>
              <Grid container spacing={2}>
                <Grid
                  xs={12}
                  sm={12}
                  md={4}
                  item
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Stack spacing={2} alignItems="center" mt={2}>
                    <Stack alignItems="center" justifyContent="center">
                      <Typography mb={3}>Hotels Images</Typography>
                      <CustomFileField
                        name="hotelImages"
                        id="hotelImages"
                        multiple
                      />
                    </Stack>
                    <Stack alignItems="center" justifyContent="center">
                      <Typography mb={3}>City Image *</Typography>
                      <CustomFileField name="cityImage" id="cityImage" />
                    </Stack>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={12} md={8} item container spacing={4}>
                  {renderInputsContent(createHotelVariants)}
                </Grid>
              </Grid>
              <CustomSubmitButton
                sx={{ mt: 4, width: { xs: '100%', md: '20%' } }}
                withLoading
                loading={isLoading}
              >
                Save
              </CustomSubmitButton>
            </StyledForm>
          </Formik>
        </StyledCreateCardContent>
      </Card>
    </MainContainer>
  )
}

export default CreateHotelPage
