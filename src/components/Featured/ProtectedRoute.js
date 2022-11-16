import { Navigate } from 'react-router-dom'
import { useAuthProvider } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuthProvider()

  if (!currentUser) {
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute
