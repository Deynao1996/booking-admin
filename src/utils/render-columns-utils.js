import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material'
import CustomButtonGroup from '../components/ButtonsUI/CustomButtonGroup'
import { format } from 'date-fns'
import styled from '@emotion/styled'
import { getCroppedImageUrl } from './crop-url-utils'

const StyledTypography = styled(Typography)(() => ({
  color: 'inherit',
  fontSize: 'inherit',
  textTransform: 'capitalize'
}))

export function createUserColumns(label) {
  return [
    {
      field: '_id',
      headerName: 'ID',
      width: 100,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row._id}>
            <Typography
              noWrap
              sx={{ color: 'inherit', fontSize: 'inherit', cursor: 'help' }}
            >
              {params.row._id}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'user',
      headerName: 'User',
      width: 230,
      valueGetter: (params) => params.row,
      sortComparator: _userNameComparator,
      renderCell: (params) => {
        const imageUrl = getCroppedImageUrl(
          params.row.photo,
          /(upload\/)(.*)/,
          '$1c_thumb,g_face,h_64,w_64/$2'
        )
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textTransform: 'capitalize'
            }}
          >
            <Avatar
              alt={params.row.userName}
              src={imageUrl}
              sx={{ width: 32, height: 32 }}
            />
            {_setUserName(params.row)}
          </Box>
        )
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 230
    },

    {
      field: 'date',
      headerName: 'Created At',
      width: 150,
      valueGetter: (params) => params.row.createdAt,
      type: 'date',
      sortComparator: _dayComparator,
      renderCell: (params) => {
        const date = format(new Date(params.row.createdAt), 'dd/MM/yy')
        return (
          <Typography color={'inherit'} fontSize={'inherit'}>
            {date}
          </Typography>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => {
        const btnColor = _getButtonColor(params.row.isVerified)
        return (
          <Button
            variant="outlined"
            size="small"
            role="Presentation"
            sx={{ pointerEvents: 'none' }}
            color={btnColor}
          >
            {params.row.isVerified ? 'Verified' : 'Not verified'}
          </Button>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <CustomButtonGroup params={params} label={label} />
      )
    }
  ]
}

export function createHotelsColumns(label) {
  return [
    {
      field: '_id',
      headerName: 'ID',
      width: 100,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row._id}>
            <Typography
              noWrap
              sx={{ color: 'inherit', fontSize: 'inherit', cursor: 'help' }}
            >
              {params.row._id}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'hotelName',
      headerName: 'Hotel',
      width: 230,
      valueGetter: (params) => params.row.name,
      sortComparator: _hotelsComparator,
      renderCell: (params) => {
        const imageUrl = getCroppedImageUrl(
          params.row.photos[0],
          /max\d+x\d+/,
          'max100x100'
        )
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textTransform: 'capitalize'
            }}
          >
            <Avatar
              alt={params.row.name}
              src={imageUrl}
              sx={{ width: 32, height: 32 }}
            />
            {params.row.name}
          </Box>
        )
      }
    },
    {
      field: 'city',
      headerName: 'City',
      width: 160,
      renderCell: (params) => {
        return <StyledTypography noWrap>{params.row.city}</StyledTypography>
      }
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 160,
      renderCell: (params) => {
        const type = params.row.type
        const slicedType = type.at(-1) === 's' ? type.slice(0, -1) : type
        return <StyledTypography noWrap>{slicedType}</StyledTypography>
      }
    },
    {
      field: 'featured',
      headerName: 'Featured',
      width: 160,
      renderCell: (params) => {
        const btnColor = _getButtonColor(params.row.featured)
        return (
          <Button
            variant="outlined"
            size="small"
            role="Presentation"
            sx={{ pointerEvents: 'none' }}
            color={btnColor}
          >
            {params.row.featured ? 'Yes' : 'No'}
          </Button>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <CustomButtonGroup params={params} label={label} />
      )
    }
  ]
}

export function createOrdersColumns(label) {
  return [
    {
      field: '_id',
      headerName: 'ID',
      width: 70,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row._id}>
            <Typography
              noWrap
              sx={{ color: 'inherit', fontSize: 'inherit', cursor: 'help' }}
            >
              {params.row._id}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'hotelName',
      headerName: 'Hotel',
      width: 200,
      valueGetter: (params) => params.row.hotelName,
      sortComparator: _hotelsComparator,
      renderCell: (params) => {
        const imageUrl = getCroppedImageUrl(
          params.row.hotelImage,
          /(upload\/)(.*)/,
          '$1c_thumb,g_face,h_64,w_64/$2'
        )
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textTransform: 'capitalize'
            }}
          >
            <Avatar
              alt={params.row.hotelName}
              src={imageUrl}
              sx={{ width: 32, height: 32 }}
            />
            <StyledTypography noWrap>{params.row.hotelName}</StyledTypography>
          </Box>
        )
      }
    },
    {
      field: 'user',
      headerName: 'User',
      width: 150,
      renderCell: (params) => {
        return <StyledTypography noWrap>{params.row.userName}</StyledTypography>
      }
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100
    },
    {
      field: 'isPaid',
      headerName: 'Payment',
      width: 160,
      renderCell: (params) => {
        return (
          <StyledTypography noWrap>
            {params.row.isPaid ? 'Online Payment' : 'Cash On Arrival'}
          </StyledTypography>
        )
      }
    },
    {
      field: 'date',
      headerName: 'Created At',
      width: 150,
      valueGetter: (params) => params.row.createdAt,
      type: 'date',
      sortComparator: _dayComparator,
      renderCell: (params) => {
        const date = format(new Date(params.row.createdAt), 'dd/MM/yy')
        return (
          <Typography color={'inherit'} fontSize={'inherit'}>
            {date}
          </Typography>
        )
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 160,
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            size="small"
            role="Presentation"
            sx={{ pointerEvents: 'none' }}
            color={params.row.status === 'done' ? 'success' : 'warning'}
          >
            {params.row.status}
          </Button>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <CustomButtonGroup params={params} label={label} />
      )
    }
  ]
}

export function createRoomsColumns(label) {
  return [
    {
      field: '_id',
      headerName: 'ID',
      width: 100,
      renderCell: (params) => {
        return (
          <Tooltip title={params.row._id}>
            <Typography
              noWrap
              sx={{ color: 'inherit', fontSize: 'inherit', cursor: 'help' }}
            >
              {params.row._id}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      field: 'hotelName',
      headerName: 'Hotel',
      width: 230,
      valueGetter: (params) => params.row.hotelName,
      sortComparator: _hotelsComparator,
      renderCell: (params) => {
        const imageUrl = getCroppedImageUrl(
          params.row.hotelImage,
          /max\d+x\d+/,
          'max100x100'
        )
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              textTransform: 'capitalize'
            }}
          >
            <Avatar
              alt={params.row.hotelName}
              src={imageUrl}
              sx={{ width: 32, height: 32 }}
            />
            {params.row.hotelName}
          </Box>
        )
      }
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 100
    },
    {
      field: 'maxPeople',
      headerName: 'Max People',
      width: 100
    },
    {
      field: 'title',
      headerName: 'Name',
      width: 160,
      renderCell: (params) => {
        return <StyledTypography noWrap>{params.row.title}</StyledTypography>
      }
    },
    {
      field: 'date',
      headerName: 'Created At',
      width: 150,
      valueGetter: (params) => params.row.createdAt,
      type: 'date',
      sortComparator: _dayComparator,
      renderCell: (params) => {
        const date = format(new Date(params.row.createdAt), 'dd/MM/yy')
        return (
          <Typography color={'inherit'} fontSize={'inherit'}>
            {date}
          </Typography>
        )
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <CustomButtonGroup params={params} label={label} />
      )
    }
  ]
}

function _dayComparator(v1, v2) {
  return new Date(v1) - new Date(v2)
}

function _userNameComparator(v1, v2) {
  const firstName = _setUserName(v1)
  const secondName = _setUserName(v2)
  return firstName.localeCompare(secondName)
}

function _hotelsComparator(v1, v2) {
  return v1.localeCompare(v2)
}

function _setUserName(user) {
  let userName = 'Not provide'
  if (user.lastName === 'Not provide' || user.name === 'Not provide') {
    userName = user.userName
  } else if (user.lastName && user.name) {
    userName = `${user.lastName} ${user.name}`
  }
  return userName
}

function _getButtonColor(param) {
  let customColor = 'error'
  switch (param) {
    case true:
      customColor = 'success'
      break
    case false:
      customColor = 'warning'
      break

    default:
      break
  }
  return customColor
}
