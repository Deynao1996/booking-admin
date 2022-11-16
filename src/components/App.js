import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import ContainerLayout from '../layouts/ContainerLayout'
import MainLayout from '../layouts/MainLayout'
import CustomerPage from '../pages/CustomerPage'
import ErrorPage from '../pages/ErrorPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import ProtectedRoute from './Featured/ProtectedRoute'
import ScrollToTop from './Featured/ScrollToTop'
import { SnackbarProvider } from 'notistack'
import loadable from '@loadable/component'
import BackdropLoading from './LoadingsUI/BackdropLoading'
import HotelPage from '../pages/HotelPage'
import OrderPage from '../pages/OrderPage'
import RoomPage from '../pages/RoomPage'

const CreateUserPage = loadable(() => import('../pages/CreateUserPage'), {
  fallback: <BackdropLoading />
})
const CreateHotelPage = loadable(() => import('../pages/CreateHotelPage'), {
  fallback: <BackdropLoading />
})
const CreateOrderPage = loadable(() => import('../pages/CreateOrderPage'), {
  fallback: <BackdropLoading />
})
const CreateRoomPage = loadable(() => import('../pages/CreateRoomPage'), {
  fallback: <BackdropLoading />
})
const TablePage = loadable(() => import('../pages/TablePage'), {
  fallback: <BackdropLoading />
})

const App = () => (
  <SnackbarProvider maxSnack={3}>
    <AuthProvider>
      <ThemeProvider>
        <ScrollToTop>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="users/:userId" element={<CustomerPage />} />
              <Route path="hotels/:hotelId" element={<HotelPage />} />
              <Route path="orders/:orderId" element={<OrderPage />} />
              <Route path="rooms/:roomId" element={<RoomPage />} />
              <Route path="table" element={<TablePage />} />
              <Route path="create">
                <Route path="users" element={<CreateUserPage />} />
                <Route path="hotels" element={<CreateHotelPage />} />
                <Route path="orders" element={<CreateOrderPage />} />
                <Route path="rooms" element={<CreateRoomPage />} />
              </Route>
            </Route>
            <Route path="/login" element={<ContainerLayout />}>
              <Route index element={<LoginPage />} />
            </Route>
            <Route path="*" element={<ContainerLayout />}>
              <Route path="*" element={<ErrorPage />} />
            </Route>
          </Routes>
        </ScrollToTop>
      </ThemeProvider>
    </AuthProvider>
  </SnackbarProvider>
)

export default App
