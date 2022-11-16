import { useParams } from 'react-router-dom'
import Charts from '../components/Wrappers/ChartsWrapper.js'
import HotelInfo from '../components/Info/HotelInfo'
import TransactionsList from '../components/Tables/TransactionsList'
import { MainContainer } from './HomePage'
import { useQuery } from '@tanstack/react-query'
import { useHandleError } from '../hooks/useHandleError.js'
import { fetchMonthSales } from '../utils/service-utils.js'

const HotelPage = () => {
  const { hotelId } = useParams()
  const { data, isFetching, isError, error } = useQuery(
    ['hotel-sales', { hotelId }],
    fetchMonthSales,
    {
      enabled: !!hotelId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  return (
    <MainContainer>
      <Charts
        title="Hotel Booking ( Last 6 Months ), $"
        aspect={3 / 1}
        hotelId={hotelId}
        data={data}
        isLoading={isFetching}
      >
        <HotelInfo />
      </Charts>
      <TransactionsList createdAt={-1} limit={5} hotelId={hotelId} />
    </MainContainer>
  )
}

export default HotelPage
