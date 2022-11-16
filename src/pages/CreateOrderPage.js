import { MainContainer } from './HomePage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Card, CardHeader, Grid, Stack } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import CustomSubmitButton from '../components/FormsUI/CustomSubmitButton'
import DatePickerField from '../components/FormsUI/DatePickerField'
import { createDateVariants, createOrderVariants } from '../data/inputs-data'
import { endRangeDate, today } from '../data/data'
import {
  validateComparisonDates,
  validateImageFormat,
  validateMaxDate,
  validatePositiveNumber
} from '../utils/validate-utils'
import CustomFileField from '../components/FormsUI/CustomFileField'
import { getDatesInRange, getDateWithoutTime } from '../utils/date-utils'
import { useMutation } from '@tanstack/react-query'
import {
  changeUnavailableDates,
  createOrder,
  changeOrder,
  clearUnavailableDates
} from '../utils/service-utils'
import { renderInputsContent } from '../utils/render-inputs-utils'
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
  user: {
    name: '',
    id: ''
  },
  hotel: {
    name: '',
    rooms: [],
    id: ''
  },
  room: {
    name: '',
    roomId: '',
    currentRoomId: ''
  },
  orderPrice: 1,
  status: 'pending',
  paid: 'no',
  arrivalDate: today,
  departureDate: endRangeDate,
  orderImages: [],
  descr: ''
}

const validationSchema = Yup.object({
  user: Yup.object({
    name: Yup.string().required('Username is required!')
  }),
  hotel: Yup.object({
    name: Yup.string().required('Hotel is required!')
  }),
  room: Yup.object().shape({
    name: Yup.string().required('Required field')
  }),
  orderPrice: Yup.number()
    .positive(validatePositiveNumber('Price'))
    .max(100000, 'Must be less than 100000')
    .required('Required field'),
  arrivalDate: Yup.date()
    .nullable()
    .typeError('Invalid date')
    .required('Start Date is required. Invalid date format')
    .max(endRangeDate, ({ max }) => validateMaxDate(max, 'Arrival')),
  departureDate: Yup.date()
    .nullable()
    .typeError('End date is required')
    .required('Start Date is required. Invalid date format')
    .when('arrivalDate', validateComparisonDates)
    .max(endRangeDate, ({ max }) => validateMaxDate(max, 'Departure')),
  descr: Yup.string().required('Required field'),
  orderImages: Yup.array().of(
    Yup.mixed().test('fileFormat', 'Unsupported Format', validateImageFormat)
  )
})

const CreateOrderPage = () => {
  const location = useLocation()
  const { mutateAsync: mutateUnavailableDates } = useMutation(
    changeUnavailableDates
  )
  const { mutateAsync: clearPrevUnavailableDates } = useMutation(
    clearUnavailableDates
  )
  const { mutateAsync: mutateOrder } = useMutation(createOrder)
  const { mutateAsync: putOrder } = useMutation(changeOrder)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const orderData = useMemo(
    () => parseOrderData(location.state?.data),
    [location.key]
  )

  function createOrderData(value) {
    return {
      userId: value.user.id,
      hotelId: value.hotel.id,
      userName: value.user.name,
      hotelImage: value.orderImages[0] || '',
      reserveRooms: [value.room.currentRoomId],
      hotelName: value.hotel.name,
      descr: value.descr,
      price: value.orderPrice,
      isPaid: convertVariantToBool(value.paid),
      status: value.status,
      dates: getDatesInRange(value.arrivalDate, value.departureDate)
    }
  }

  function onSuccess(res, resetForm) {
    enqueueSnackbar(res.data.successMsg, {
      variant: 'success'
    })
    resetForm()
  }

  function getTimeDatesFromVariants(order) {
    return {
      arrivalDateFromOrder: order.dates[0],
      departureDateFromOrder: order.dates[1],
      getArrivalDateTime: new Date(
        getDateWithoutTime(orderData.arrivalDate)
      ).getTime(),
      getDepartureDateTime: new Date(
        getDateWithoutTime(orderData.departureDate)
      ).getTime()
    }
  }

  async function replaceUnavailableDates(order) {
    const {
      arrivalDateFromOrder,
      departureDateFromOrder,
      getArrivalDateTime,
      getDepartureDateTime
    } = getTimeDatesFromVariants(order)
    const prevDates = [getArrivalDateTime, getDepartureDateTime]
    if (
      arrivalDateFromOrder !== getArrivalDateTime &&
      departureDateFromOrder !== getDepartureDateTime
    ) {
      order.dates[0] = arrivalDateFromOrder
      order.dates[1] = departureDateFromOrder
      await mutateUnavailableDates({
        roomId: order.reserveRooms[0],
        dates: order.dates
      })
      await clearPrevUnavailableDates({
        roomId: order.reserveRooms[0],
        dates: prevDates
      })
    }
  }

  async function changePhotoImage(order) {
    if (order.hotelImage === orderData.orderImages[0]) {
    } else {
      if (order.hotelImage) {
        const imageUrl = await sendImageToCloud(order.hotelImage)
        order.hotelImage = imageUrl
      }
    }
  }

  async function handleChangeSubmit(value, { resetForm }) {
    const order = createOrderData(value)
    const { orderId } = orderData

    try {
      await replaceUnavailableDates(order)
      await changePhotoImage(order)
      const res = await putOrder({
        orderId,
        changedData: order
      })
      onSuccess(res, resetForm)
      navigate(-1)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  async function handleCreateSubmit(value, { resetForm }) {
    const order = createOrderData(value)

    try {
      await mutateUnavailableDates({
        roomId: order.reserveRooms[0],
        dates: order.dates
      })
      if (order.hotelImage) {
        const imageUrl = await sendImageToCloud(order.hotelImage)
        order.hotelImage = imageUrl
      }
      const res = await mutateOrder(order)
      onSuccess(res, resetForm)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  function renderDatePickersContent() {
    return createDateVariants.map((props) => {
      return (
        <Grid item xs={12} sm={6} md={6} key={props.id}>
          <DatePickerField {...props} />
        </Grid>
      )
    })
  }

  function parseOrderData(data) {
    if (!data) return
    const order = JSON.parse(data)
    const arrivalDate = new Date(order.dates[0])
    const departureDate = new Date(order.dates.at(-1))
    return {
      user: {
        name: order.userName,
        id: order.userId
      },
      hotel: {
        name: order.hotelName,
        rooms: [order.orderedRoom.roomId],
        id: order.hotelId
      },
      room: {
        name: order.orderedRoom.name,
        roomId: order.orderedRoom.roomId,
        currentRoomId: order.orderedRoom.currentRoomId
      },
      orderPrice: order.price,
      status: order.status,
      paid: convertBoolToVariant(order.isPaid),
      arrivalDate,
      departureDate,
      orderImages: [order.hotelImage],
      descr: order.descr,
      orderId: order._id
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MainContainer>
        <Card sx={{ p: 2, mt: 3 }}>
          <CardHeader
            title="Add New Orders"
            titleTypographyProps={{
              color: 'text.secondary'
            }}
            sx={{ p: 0 }}
            color={'text.secondary'}
          />
          <StyledCreateCardContent component="div">
            <Formik
              initialValues={orderData ? orderData : initialValues}
              validationSchema={validationSchema}
              validateOnChange={false}
              validateOnBlur={false}
              onSubmit={orderData ? handleChangeSubmit : handleCreateSubmit}
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
                        <CustomFileField name="orderImages" id="orderImages" />
                      </Stack>
                    </Grid>
                    <Grid xs={12} sm={12} md={8} item container spacing={4}>
                      {renderInputsContent(createOrderVariants)}
                      {renderDatePickersContent()}
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
    </LocalizationProvider>
  )
}

export default CreateOrderPage
