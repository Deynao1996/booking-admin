import styled from '@emotion/styled'
import { ManageAccounts } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  IconButton,
  Skeleton,
  Tooltip,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fetchFlats, fetchOrder } from '../../utils/service-utils'
import _isBoolean from 'lodash/isBoolean'
import { orderInfoVariants } from '../../data/single-info-data'
import { useMemo } from 'react'
import { useHandleError } from '../../hooks/useHandleError'
import { convertBoolToVariant } from '../../utils/convert-variant-utils'
import { StyledBox, StyledCardContent, StyledLink } from '../../styled/styled'

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 200,
  height: 200,
  [theme.breakpoints.down('sm')]: {
    width: 100,
    height: 100
  }
}))

const OrderInfo = ({ orderId }) => {
  const {
    data,
    isError: isOrderError,
    error: orderError
  } = useQuery(['order', orderId], fetchOrder)
  const hotelId = data?.data.hotelId
  const reservedRoomId = data?.data.reserveRooms[0]
  const {
    data: flats,
    isLoading,
    isError: isFlatsError,
    error: flatsError
  } = useQuery(['flats', hotelId], fetchFlats, {
    enabled: !!hotelId && !!reservedRoomId
  })
  const orderedRoom = useMemo(() => flats && setOrderedRoom(flats), [flats])
  useHandleError(isOrderError, orderError)
  useHandleError(isFlatsError, flatsError)

  function setOrderedRoom(data) {
    const { _id, title, roomNumbers } = data?.data[0]
    const { number } = roomNumbers.find((room) => room._id === reservedRoomId)
    return {
      name: `${number}: ${title}`,
      roomId: _id,
      currentRoomId: reservedRoomId
    }
  }

  function setRoomNumberStr() {
    return orderedRoom.name.split(':')[0].trim()
  }

  function setDateOfRegistration(data) {
    return data?.data ? format(new Date(data.data.createdAt), 'dd/MM/yy') : ''
  }

  function setSettlingDates(data) {
    const arrivalDate = format(new Date(data[0]), 'MM/dd/yyyy')
    const departureDate = format(new Date(data.at(-1)), 'MM/dd/yyyy')
    return `${arrivalDate} - ${departureDate}`
  }

  function setCorrectValue(data, { label, type, postfix }) {
    if (type === 'boolean') return convertBoolToVariant(data?.data[label])
    if (type === 'date') return setDateOfRegistration(data)
    if (type === 'dates') return setSettlingDates(data?.data[label])
    if (type === 'rooms') return setRoomNumberStr()
    if (postfix) return data?.data[label] + postfix
    return data?.data[label]
  }

  function renderCustomerInfoContent(data) {
    return orderInfoVariants.map(({ title, isCapitalized, ...variant }, i) => {
      return (
        <StyledBox key={i}>
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            fontWeight={700}
          >
            {title}:{' '}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              textTransform: isCapitalized ? 'capitalize' : 'none',
              marginLeft: 'auto'
            }}
          >
            {setCorrectValue(data, variant)}
          </Typography>
        </StyledBox>
      )
    })
  }

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <CardHeader
        title={
          !isLoading ? 'Information' : <Skeleton animation="wave" width="40%" />
        }
        titleTypographyProps={{
          fontSize: 16,
          color: 'text.secondary',
          fontWeight: 'bold'
        }}
        action={
          !isLoading && (
            <Tooltip title="Edit order">
              <StyledLink
                to="/create/orders"
                state={{
                  data: JSON.stringify({ ...data.data, orderedRoom })
                }}
              >
                <IconButton>
                  <ManageAccounts />
                </IconButton>
              </StyledLink>
            </Tooltip>
          )
        }
        sx={{ p: 0 }}
        color={'text.secondary'}
      />
      <StyledCardContent>
        {!isLoading ? (
          <StyledAvatar alt={data?.data.userName} src={data?.data.hotelImage} />
        ) : (
          <Skeleton
            animation="wave"
            variant="circular"
            sx={{
              width: { xs: 100, sm: 200 },
              height: { xs: 100, sm: 200 }
            }}
          />
        )}
        {!isLoading ? (
          <Box>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{ textTransform: 'capitalize' }}
            >
              {data?.data.userName}
            </Typography>
            {renderCustomerInfoContent(data)}
          </Box>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{
              width: { xs: '60%', sm: '40%' },
              height: { xs: 200, sm: '20vw', lg: '15vw' }
            }}
          />
        )}
      </StyledCardContent>
    </Card>
  )
}

export default OrderInfo
