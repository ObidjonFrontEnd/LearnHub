import { Route, Routes } from 'react-router-dom'
import MainLayout from './Layout/MainLayout'
import Home from './page/Home'
import AutheLayout from './Layout/AuthLayout'
import Login from './page/Auth/Login'
import Register from './page/Auth/Register'


function App() {
	return (
		<section >
			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<Home />} />
				</Route>
        <Route element={<AutheLayout/>} >
          <Route path='/login' element={<Login/>} />
          <Route  path='/register' element={<Register/>} />
        </Route>
			</Routes>
		</section>
	)
}

export default App
