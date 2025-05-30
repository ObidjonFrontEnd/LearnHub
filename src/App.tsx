import { Route, Routes } from 'react-router-dom'
import { NotificationHandler } from './components/I/NotificationHandler'
import AutheLayout from './Layout/AuthLayout'
import MainLayout from './Layout/MainLayout'
import Login from './page/Auth/Login'
import Otp from './page/Auth/Otp'
import Register from './page/Auth/Register'
import Home from './page/Home'


function App() {

	
	return (
		<section className='w-wull overflow-x-hidden'>
			<NotificationHandler />
			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />
					<Route path="/centers/:id" element={""}/>
				</Route>
				<Route element={<AutheLayout />}>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/otp' element={<Otp />} />
				</Route>
			</Routes>
		</section>
	)
}

export default App
