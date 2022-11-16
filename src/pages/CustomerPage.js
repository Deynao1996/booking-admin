import { useParams } from 'react-router-dom'
import Charts from '../components/Wrappers/ChartsWrapper.js'
import CustomerInfo from '../components/Info/CustomerInfo'
import TransactionsList from '../components/Tables/TransactionsList'
import { MainContainer } from './HomePage'
import { fetchMonthSales } from '../utils/service-utils.js'
import { useQuery } from '@tanstack/react-query'
import { useHandleError } from '../hooks/useHandleError.js'

const CustomerPage = () => {
  const { userId } = useParams()
  const { data, isFetching, isError, error } = useQuery(
    ['user-sales', { userId }],
    fetchMonthSales,
    {
      enabled: !!userId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  return (
    <MainContainer>
      <Charts
        title="User Spending ( Last 6 Months ), $"
        aspect={3 / 1}
        userId={userId}
        data={data}
        isLoading={isFetching}
      >
        <CustomerInfo />
      </Charts>
      <TransactionsList createdAt={-1} limit={5} userId={userId} />
    </MainContainer>
  )
}

export default CustomerPage
