import { ManageAccounts } from '@mui/icons-material'
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Skeleton,
  Tooltip,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchHotel } from '../../utils/service-utils'
import _isBoolean from 'lodash/isBoolean'
import { hotelInfoVariants } from '../../data/single-info-data'
import { useHandleError } from '../../hooks/useHandleError'
import { convertBoolToVariant } from '../../utils/convert-variant-utils'
import {
  StyledAvatar,
  StyledBox,
  StyledCardContent,
  StyledLink
} from '../../styled/styled'

const HotelInfo = ({ hotelId }) => {
  const { data, isLoading, isError, error } = useQuery(
    ['hotel', hotelId],
    fetchHotel
  )
  useHandleError(isError, error)

  function setCorrectValue(data, { label, postfix, type }) {
    if (type === 'boolean') return convertBoolToVariant(data?.data[label])
    if (postfix) return data?.data[label] + postfix
    return data?.data[label]
  }

  function renderHotelInfoContent(data) {
    return hotelInfoVariants.map((variant, i) => {
      return (
        <StyledBox key={i}>
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            fontWeight={700}
          >
            {variant.title}:{' '}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ textTransform: 'capitalize', marginLeft: 'auto' }}
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
            <Tooltip title="Edit hotel">
              <StyledLink
                to="/create/hotels"
                state={{ data: JSON.stringify(data.data) }}
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
          <StyledAvatar alt={data?.data.name} src={data?.data.photos[0]} />
        ) : (
          <Skeleton
            animation="wave"
            variant="circular"
            sx={{
              width: { xs: 100, sm: 200, lg: 100 },
              height: { xs: 100, sm: 200, lg: 100 }
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
              {data?.data.name}
            </Typography>
            {renderHotelInfoContent(data)}
          </Box>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{
              width: { xs: '60%', sm: '40%', lg: '60%' },
              height: { xs: 200, sm: '20vw', lg: '10vw' }
            }}
          />
        )}
      </StyledCardContent>
    </Card>
  )
}

export default HotelInfo
