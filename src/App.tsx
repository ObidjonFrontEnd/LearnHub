import { Route, Routes } from 'react-router-dom'
import { NotificationHandler } from './components/I/NotificationHandler'
import PrivateRoute from './hooks/PrivateRoute'
import PublicRoute from './hooks/PublicRoute'
import TokenRefresher from './hooks/useRefreshtoken'
import AutheLayout from './Layout/AuthLayout'
import MainLayout from './Layout/MainLayout'
import Login from './page/Auth/Login'
import Otp from './page/Auth/Otp'
import Register from './page/Auth/Register'
import Center from './page/center'
import Home from './page/Home'
import Profile from './page/profile'
import ProfileEdite from './page/profile/components/profileEdite'

import GetMyCenters from './page/SEO/components/getCard'
import { useAuth } from './store/useAuth'
import AddCenter from './page/SEO/components/addCenter'
import EditCenter from './page/SEO/components/edite'
import Queues from './page/queues'
import LikedCenters from './page/likeCenters'
import GetFillialsByid from './page/filials'
import Resurses from './page/resurslar'

function App() {
	const isAuthenticated = useAuth(state => state.isAuthenticated())

	return (
		<section className='w-full'>
			<NotificationHandler />

			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path='/center/:id' element={<Center />} />
					<Route path='/filials/:id' element={<GetFillialsByid/>} />

					<Route element={<PrivateRoute />}>
						<Route path='/profile' element={<Profile />} />
						<Route path='/profile/edite' element={<ProfileEdite />} />
						<Route path='/navbat' element={<Queues/>}/>
						<Route path='/sevimli' element={<LikedCenters/>} />
						<Route path='/resurlar' element={<Resurses/>} />

						<Route path='/seo'>
							<Route path='myCenters' index element={<GetMyCenters />} />
							<Route path='edite/:id' element={<EditCenter />} />
							<Route path='addCenter' element={<AddCenter />} />
						</Route>
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
