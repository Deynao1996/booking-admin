import styled from '@emotion/styled'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fetchTransactions } from '../../utils/service-utils'
import { useHandleError } from '../../hooks/useHandleError'
import { useAuthProvider } from '../../contexts/AuthContext'
import { StyledLink } from '../../styled/styled'

const dummyArr = [
  {
    _id: '-',
    hotelName: '-',
    userName: '-',
    price: '-',
    isPaid: '-',
    status: 'None'
  }
]

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.common.black
        : theme.palette.primary.main,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const TransactionsList = ({ requiredQuery, ...props }) => {
  const { currentUser } = useAuthProvider()
  const { data, isLoading, isError, error } = useQuery(
    ['transactions', props],
    fetchTransactions,
    {
      enabled: !!currentUser?._id && !requiredQuery
    }
  )
  useHandleError(isError, error)

  function setPaymentMethod(isPaid) {
    let res = ''
    if (isPaid && isPaid !== '-') {
      res = 'Online Payment'
    } else if (!isPaid) {
      res = 'Cash On Arrival'
    } else {
      res = '-'
    }
    return res
  }

  function renderRows(data) {
    const mappedArr =
      data?.data?.orders.length === 0 ? dummyArr : data.data.orders
    return mappedArr.map((row, i) => {
      const createdAt = row.createdAt
        ? format(new Date(row.createdAt), 'dd MMMM')
        : '-'

      return (
        <StyledTableRow
          key={row._id}
          sx={{
            '&:last-child td, &:last-child th': { border: 0 }
          }}
        >
          <TableCell component="th" scope="row" sx={{ maxWidth: 150 }}>
            <Tooltip title={row._id} sx={{ cursor: 'help' }}>
              <Typography noWrap fontSize={'inherit'}>
                {row._id}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Avatar
                alt="Hotel"
                src={row.hotelImage}
                sx={{ width: 32, height: 32 }}
              />
              {row.hotelName}
            </Box>
          </TableCell>
          <TableCell>
            <StyledLink
              isDisabled={!row.userId}
              to={`/users/${row.userId || ''}`}
            >
              {row.userName}
            </StyledLink>
          </TableCell>
          <TableCell>{createdAt}</TableCell>
          <TableCell>{row.price}</TableCell>
          <TableCell>{setPaymentMethod(row.isPaid)}</TableCell>
          <TableCell>
            <Button
              variant="outlined"
              size="small"
              sx={{ pointerEvents: 'none' }}
              color={row.status === 'done' ? 'success' : 'warning'}
            >
              {row.status}
            </Button>
          </TableCell>
        </StyledTableRow>
      )
    })
  }

  return (
    <Card sx={{ p: 2, mt: 3 }}>
      <CardHeader
        title={
          !(isLoading || isError) ? (
            'Latest Transactions'
          ) : (
            <Skeleton animation="wave" width="20%" />
          )
        }
        titleTypographyProps={{
          fontSize: 16,
          color: 'text.secondary',
          fontWeight: 'bold'
        }}
        sx={{ p: 0 }}
        color={'text.secondary'}
      />
      <CardContent sx={{ p: 0, mt: 2 }}>
        {!(isLoading || isError) ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 824 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Tracking ID</StyledTableCell>
                  <StyledTableCell>Hotel</StyledTableCell>
                  <StyledTableCell>Customer</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Amount</StyledTableCell>
                  <StyledTableCell>Payment Method</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderRows(data)}</TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Skeleton
            animation="wave"
            width="100%"
            variant="rounded"
            height="20vw"
          />
        )}
      </CardContent>
    </Card>
  )
}

export default TransactionsList
