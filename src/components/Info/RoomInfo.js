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
import { format } from 'date-fns'
import Flats from '../Flats'
import { roomInfoVariants } from '../../data/single-info-data'
import { StyledBox, StyledCardContent, StyledLink } from '../../styled/styled'

const RoomInfo = ({ roomData, isLoading }) => {
  function setDateOfRegistration(data) {
    return data?.data ? format(new Date(data.data.createdAt), 'dd/MM/yy') : ''
  }

  function setCorrectValue(data, { label, type, postfix }) {
    if (type === 'date') return setDateOfRegistration(data)
    if (type === 'rooms') return <Flats data={data} />
    if (postfix) return data?.data[label] + postfix
    return data?.data[label]
  }

  function renderRoomInfoContent(data) {
    return roomInfoVariants.map(({ isCapitalized, ...variants }, i) => {
      return (
        <StyledBox key={i}>
          <Typography
            component="span"
            variant="body2"
            color="text.secondary"
            fontWeight={700}
          >
            {variants.title}:{' '}
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            component="span"
            sx={{
              textTransform: isCapitalized ? 'capitalize' : 'none',
              marginLeft: 'auto'
            }}
          >
            {setCorrectValue(data, variants)}
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
            <Tooltip title="Edit room">
              <StyledLink
                to="/create/rooms"
                state={{ data: JSON.stringify({ ...roomData.data }) }}
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
          <Box sx={{ width: '100%' }}>{renderRoomInfoContent(roomData)}</Box>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            sx={{
              width: { xs: '100%', sm: '60vw', lg: '100%' },
              height: { xs: 200, sm: '25vw', lg: '15vw' }
            }}
          />
        )}
      </StyledCardContent>
    </Card>
  )
}

export default RoomInfo
