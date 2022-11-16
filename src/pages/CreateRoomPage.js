import { MainContainer } from './HomePage'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { Card, CardHeader, Grid } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import CustomSubmitButton from '../components/FormsUI/CustomSubmitButton'
import { createRoomVariants } from '../data/inputs-data'
import { validatePositiveNumber } from '../utils/validate-utils'
import { renderInputsContent } from '../utils/render-inputs-utils'
import { changeRoom, createRoom } from '../utils/service-utils'
import { useSnackbar } from 'notistack'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { StyledCreateCardContent, StyledForm } from '../styled/styled'

const initialValues = {
  roomTitle: '',
  roomPrice: 1,
  maxPeople: 1,
  roomNumbers: '',
  roomDescription: '',
  hotel: {
    name: '',
    rooms: [],
    id: ''
  }
}

const validationSchema = Yup.object({
  roomTitle: Yup.string().required('Required field'),
  roomPrice: Yup.number()
    .positive(validatePositiveNumber('Room Price'))
    .max(100000, ({ max }) => `Price must be less than ${max} $`)
    .required('Required field'),
  maxPeople: Yup.number()
    .typeError('Max People should be a number')
    .positive('Max People should be more than 0')
    .max(20, ({ max }) => `Max People should be less than ${max}`)
    .required('Required field'),
  roomDescription: Yup.string().required('Required field'),
  roomNumbers: Yup.string().required('Required field'),
  hotel: Yup.object({
    name: Yup.string().required('Hotel is required!')
  })
})

const CreateRoomPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { mutateAsync: mutateCreate } = useMutation(createRoom)
  const { mutateAsync: mutateChange } = useMutation(changeRoom)
  const { enqueueSnackbar } = useSnackbar()
  const roomProfileData = useMemo(
    () => parseRoomData(location.state?.data),
    [location.key]
  )
  const pageTitle = roomProfileData ? 'Update Room' : 'Create New Rooms'

  function createRoomNumbersFromStr(str) {
    return str.split(',').reduce((prev, curr) => {
      if (!curr) return prev
      prev.push({
        number: curr.trim()
      })
      return prev
    }, [])
  }

  function createRoomNumbersFromArr(room) {
    return room.roomNumbers.reduce((prev, curr, i, arr) => {
      prev += arr.length - 1 === i ? curr.number : `${curr.number}, `
      return prev
    }, '')
  }

  function parseRoomData(data) {
    if (!data) return
    const room = JSON.parse(data)
    const roomNumbers = createRoomNumbersFromArr(room)
    return {
      roomTitle: room.title,
      roomPrice: room.price,
      maxPeople: room.maxPeople,
      roomNumbers,
      roomDescription: room.descr,
      roomId: room._id,
      hotel: {
        name: room.hotel.name,
        rooms: room.hotel.rooms,
        id: room.hotel._id
      }
    }
  }

  function onSuccess(res, resetForm) {
    enqueueSnackbar(res.data, {
      variant: 'success'
    })
    resetForm()
  }

  function createRoomData(value) {
    const roomNumbers = createRoomNumbersFromStr(value.roomNumbers)
    return {
      title: value.roomTitle,
      descr: value.roomDescription,
      price: value.roomPrice,
      maxPeople: value.maxPeople,
      roomNumbers
    }
  }

  function getDifferenceRoomNumbers(value) {
    const roomsFromSubmit = createRoomNumbersFromStr(value.roomNumbers)
    const initialRooms = createRoomNumbersFromStr(roomProfileData.roomNumbers)
    const removedRooms = initialRooms.filter((object1) => {
      return !roomsFromSubmit.some((object2) => {
        return object1.number === object2.number
      })
    })
    const newRooms = roomsFromSubmit.filter((object1) => {
      return !initialRooms.some((object2) => {
        return object1.number === object2.number
      })
    })

    return { removedRooms, newRooms }
  }

  async function handleCreateSubmit(value, { resetForm }) {
    const hotelId = value.hotel.id
    const room = createRoomData(value)

    try {
      const res = await mutateCreate({
        room,
        hotelId
      })
      onSuccess(res, resetForm)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }

  async function handleChangeSubmit(value, { resetForm }) {
    const { roomNumbers, ...room } = createRoomData(value)
    const {
      hotel: { id: hotelId }
    } = value
    const { roomId } = roomProfileData
    const { removedRooms, newRooms } = getDifferenceRoomNumbers(value)
    const isHotelChanged = value.hotel.id !== roomProfileData.hotel.id
    const newRoom = isHotelChanged ? { ...room, hotelId } : room

    try {
      const res = await mutateChange({
        roomId,
        changedData: { ...newRoom, removedRooms, newRooms }
      })
      onSuccess(res, resetForm)
      navigate(-1)
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
            initialValues={roomProfileData ? roomProfileData : initialValues}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={roomProfileData ? handleChangeSubmit : handleCreateSubmit}
          >
            {({ isSubmitting }) => (
              <StyledForm>
                <Grid container spacing={2}>
                  <Grid xs={12} item container spacing={4}>
                    {renderInputsContent(createRoomVariants)}
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

export default CreateRoomPage
