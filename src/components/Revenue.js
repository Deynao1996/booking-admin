import styled from '@emotion/styled'
import { TrendingDown, TrendingUp } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
  Typography
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { currentMonth, DAILY_TARGET_SALES } from '../data/data'
import { useHandleError } from '../hooks/useHandleError'
import { fetchTodaySales } from '../utils/service-utils'

import 'react-circular-progressbar/dist/styles.css'

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(3)
}))

function calculatePercentage(partialValue, totalValue) {
  if (!partialValue) return
  return Math.round((100 * partialValue) / totalValue)
}

function getFixedValue(value) {
  return (value / 1000).toFixed(1)
}

function sortMonthsByCurrentMonth(arr) {
  if (!arr) return
  const sortedArr = arr.sort((a, b) => a._id - b._id)
  const leftSide = sortedArr.slice(0, currentMonth)
  const rightSide = sortedArr.slice(currentMonth)
  return [...rightSide, ...leftSide]
}

export function getLastMonths(arr, num) {
  if (!arr) return
  const lastMonthNumbers = new Array(num).fill('').reduce((prev, _curr, i) => {
    prev.push(currentMonth - i)
    return prev
  }, [])
  const newArr = lastMonthNumbers.map((num) => {
    const obj = arr?.data.find((item) => item._id === num) || {
      _id: num,
      total: 0
    }
    return obj
  })
  return sortMonthsByCurrentMonth(newArr)
}

const Revenue = ({
  currentUser,
  isLoading: isMonthLoading,
  data: monthSales
}) => {
  const {
    data: todaySales,
    isLoading: isTodayLoading,
    isError: isTodayError,
    error: todayError
  } = useQuery(['today-sales'], fetchTodaySales, {
    enabled: !!currentUser?._id,
    refetchOnWindowFocus: false
  })
  useHandleError(isTodayError, todayError)
  const isLoading = isTodayLoading || isMonthLoading

  const lasTwoMonths = useMemo(() => getLastMonths(monthSales, 2), [monthSales])
  const todayTotalSales = todaySales?.data?.[0]?.total
  const percentage = calculatePercentage(todayTotalSales, DAILY_TARGET_SALES)
  const targetDiff = todayTotalSales
    ? getFixedValue(DAILY_TARGET_SALES - todayTotalSales)
    : getFixedValue(DAILY_TARGET_SALES)

  function renderMonthSales() {
    return lasTwoMonths?.map((sale, i) => {
      const title = i === 0 ? 'Prev Month' : 'Curr Month'
      return (
        <Box key={i}>
          <Typography component="div" align="justify">
            {title}
          </Typography>
          <Typography
            component="div"
            align="justify"
            color="success.dark"
            mt={1}
          >
            <TrendingUp fontSize="1rem" />
            {` $${getFixedValue(sale.total)}k`}
          </Typography>
        </Box>
      )
    })
  }

  return (
    <Card sx={{ p: 2, height: '100%' }}>
      <CardHeader
        title={
          !isLoading ? (
            'Total Revenue'
          ) : (
            <Skeleton animation="wave" width="60%" sx={{ mb: 2 }} />
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
      <StyledCardContent>
        <Box sx={{ width: '95px', height: '95px' }}>
          {!isLoading ? (
            <CircularProgressbar
              value={percentage || 0}
              text={`${percentage || 0}%`}
              strokeWidth={5}
            />
          ) : (
            <Skeleton
              animation="wave"
              variant="circular"
              width={95}
              height={95}
            />
          )}
        </Box>
        {!isLoading ? (
          <Typography
            color="text.secondary"
            variant="subtitle1"
            component="span"
            align="center"
            fontWeight={'bold'}
          >
            Total sales made today
          </Typography>
        ) : (
          <Skeleton animation="wave" width="50%" />
        )}
        {!isLoading ? (
          <Typography variant="h5" component="span">
            {todayTotalSales ? `$${todayTotalSales}` : '$0'}
          </Typography>
        ) : (
          <Skeleton animation="wave" width="20%" />
        )}
        {!isLoading ? (
          <Typography
            variant="body2"
            component="span"
            align="center"
            color={'text.secondary'}
            fontSize={12}
          >
            Previous transactions processing. Last payments may not be included.
          </Typography>
        ) : (
          <Skeleton animation="wave" width="80%" />
        )}
        {!isLoading ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems={'flex-start'}
            sx={{ width: '100%' }}
            color={'text.secondary'}
          >
            <DailyTargetSale value={targetDiff} />
            {renderMonthSales()}
          </Stack>
        ) : (
          <Skeleton
            animation="wave"
            variant="rounded"
            width="100%"
            height="100px"
          />
        )}
      </StyledCardContent>
    </Card>
  )
}

const DailyTargetSale = ({ value }) => {
  const color = value > 0 ? 'error' : 'success.dark'

  function renderArrow() {
    return value > 0 ? (
      <TrendingDown fontSize="1rem" />
    ) : (
      <TrendingUp fontSize="1rem" />
    )
  }

  function getFormattedValue() {
    return ` $${value.replace(/-/g, '')}k`
  }

  return (
    <Box>
      <Typography component="div" align="left">
        Daily Target
      </Typography>
      <Typography component="div" align="justify" color={color} mt={1}>
        {renderArrow()}
        {getFormattedValue()}
      </Typography>
    </Box>
  )
}

export default Revenue
