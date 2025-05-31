import { useAuth } from '@/store/useAuth'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
	const isAuthenticated = useAuth(state => state.isAuthenticated())

	return !isAuthenticated ? <Outlet /> : <Navigate to='/' replace />
}

export default PublicRoute
