import { Route, Routes } from 'react-router-dom'
import { NotificationHandler } from './components/I/NotificationHandler'
import AutheLayout from './Layout/AuthLayout'
import MainLayout from './Layout/MainLayout'
import Login from './page/Auth/Login'
import Otp from './page/Auth/Otp'
import Register from './page/Auth/Register'
import Home from './page/Home'
import Profile from './page/profile'
import TokenRefresher from './hooks/useRefreshtoken'
import { useAuth } from './store/useAuth'
import PrivateRoute from './hooks/PrivateRoute'
import PublicRoute from './hooks/PublicRoute'
import ProfileEdite from './page/profile/components/profileEdite'


function App() {
	const isAuthenticated = useAuth((state) => state.isAuthenticated())

	return (
		<section className='w-full'>
			<NotificationHandler />

			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />

					<Route element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
						<Route path='/profile/edite' element={<ProfileEdite/>}/>
					</Route>

			
					<Route element={<PublicRoute />}>
						<Route element={<AutheLayout />}>
							<Route path='/login' element={<Login />} />
							<Route path='/register' element={<Register />} />
							<Route path='/otp' element={<Otp />} />
						</Route>
					</Route>
				</Route>
			</Routes>

			{isAuthenticated && <TokenRefresher />}
		</section>
	)
}

export default App
