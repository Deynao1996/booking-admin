import styled from '@emotion/styled'
import Revenue from '../components/Revenue'
import Widgets from '../components/Widgets'
import Charts from '../components/Wrappers/ChartsWrapper.js'
import TransactionsList from '../components/Tables/TransactionsList'
import { useAuthProvider } from '../contexts/AuthContext'
import { fetchMonthSales } from '../utils/service-utils'
import { useQuery } from '@tanstack/react-query'
import { useHandleError } from '../hooks/useHandleError'

export const MainContainer = styled('main')(({ theme }) => ({
  padding: theme.spacing(2, 1),
  flex: 6,
  width: '100%'
}))

const HomePage = () => {
  const { currentUser } = useAuthProvider()
  const { data, isFetching, isError, error } = useQuery(
    ['month-sales'],
    fetchMonthSales,
    {
      enabled: !!currentUser?._id,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  return (
    <MainContainer>
      <Widgets />
      <Charts
        title="Revenue ( Last 6 Months ), $"
        aspect={2 / 1}
        currentUser={currentUser}
        data={data}
        isLoading={isFetching}
      >
        <Revenue />
      </Charts>
      <TransactionsList limit={5} createdAt={-1} />
    </MainContainer>
  )
}

export default HomePage
