import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/store/useAuth'

const PrivateRoute = () => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated())

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
