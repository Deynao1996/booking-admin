import { Card, CardContent, CardHeader, Skeleton } from '@mui/material'
import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { getLastMonths } from '../Revenue'

const Chart = ({ aspect, title, isLoading, data }) => {
  const k = 45
  const MONTHS = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    []
  )
  const lastSixMonths = useMemo(() => getLastMonths(data, 6), [data])
  const chartData = useMemo(
    () => getTransformedData(lastSixMonths),
    [lastSixMonths]
  )

  function getTransformedData(lastSixMonths) {
    if (!lastSixMonths) return []
    return lastSixMonths.map((sale) => {
      return {
        name: MONTHS[sale._id - 1],
        Total: sale.total
      }
    })
  }

  return (
    <Card sx={{ p: 2 }}>
      <CardHeader
        title={!isLoading ? title : <Skeleton animation="wave" width="40%" />}
        titleTypographyProps={{
          fontSize: 16,
          color: 'text.secondary',
          fontWeight: 'bold'
        }}
        sx={{ p: 0 }}
      />
      <CardContent sx={{ px: 0 }}>
        {!isLoading ? (
          <ResponsiveContainer width="100%" aspect={aspect}>
            <AreaChart
              width={730}
              height={250}
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="gray" />
              <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Total"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#total)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton
            animation="wave"
            width="100%"
            height={`${k / aspect}vw`}
            variant="rounded"
          />
        )}
      </CardContent>
    </Card>
  )
}

export default Chart
