
import { Outlet } from 'react-router-dom'
import Header from '../components/header'


const MainLayout = () => {
	return (
		<div>
			<Header/>
			<Outlet />
		</div>
	)
}

export default MainLayout
