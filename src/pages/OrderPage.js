import { useParams } from 'react-router-dom'
import { MainContainer } from './HomePage'
import OrderInfo from '../components/Info/OrderInfo.js'
import { Grid } from '@mui/material'

const OrderPage = () => {
  const { orderId } = useParams()

  return (
    <MainContainer>
      <Grid container spacing={3}>
        <Grid xs={12} item>
          <OrderInfo orderId={orderId} />
        </Grid>
      </Grid>
    </MainContainer>
  )
}

export default OrderPage
