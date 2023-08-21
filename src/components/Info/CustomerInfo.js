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
import { stringAvatar } from '../../utils/avatar-utils'
import { format } from 'date-fns'
import { fetchUser } from '../../utils/service-utils'
import _isBoolean from 'lodash/isBoolean'
import { customerInfoVariants } from '../../data/single-info-data'
import { useHandleError } from '../../hooks/useHandleError'
import { convertBoolToVariant } from '../../utils/convert-variant-utils'
import {
  StyledAvatar,
  StyledBox,
  StyledCardContent,
  StyledLink
} from '../../styled/styled'
import React from 'react'
import { getCroppedImageUrl } from '../../utils/crop-url-utils'

const CustomerInfo = ({ userId }) => {
  const { data, isLoading, isError, error } = useQuery(
    ['user', userId],
    fetchUser
  )
  useHandleError(isError, error)

  const imageUrl = getCroppedImageUrl(
    data?.data.photo,
    /(upload\/)(.*)/,
    '$1c_thumb,g_face,h_250,w_250/$2'
  )

  function setDateOfRegistration(data) {
    return data?.data ? format(new Date(data.data.createdAt), 'dd/MM/yy') : ''
  }

  function setCorrectValue(data, { label, type }) {
    if (type === 'boolean') return convertBoolToVariant(data?.data[label])
    if (type === 'date') return setDateOfRegistration(data)
    return data?.data[label]
  }

  function setFullName() {
    if (!data?.data) return
    const msg = 'Not provide'
    let fullName = msg
    if (data.data.name === msg && data.data.lastName === msg) {
      fullName = msg
    } else {
      fullName = `${data.data.name} ${data.data.lastName}`
    }
    return fullName
  }

  const fullName = setFullName()

  function renderCustomerInfoContent(data) {
    return customerInfoVariants.map(
      ({ label, type, title, isCapitalized, ...props }, i) => {
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
                marginLeft: 'auto',
                ...props
              }}
            >
              {setCorrectValue(data, { label, type, title })}
            </Typography>
          </StyledBox>
        )
      }
    )
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
            <Tooltip title="Edit user">
              <StyledLink
                to="/create/users"
                state={{ data: JSON.stringify({ ...data.data, userId }) }}
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
          <StyledAvatar
            alt={data?.data.userName}
            src={imageUrl}
            {...stringAvatar(fullName)}
          />
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
            {fullName !== 'Not provide' && (
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{ textTransform: 'capitalize' }}
              >
                {fullName}
              </Typography>
            )}

            {renderCustomerInfoContent(data)}
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

export default React.memo(CustomerInfo)
