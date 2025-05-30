
import Cards from './components/cards'
import Modal from './components/modal'
import Search from './components/search'

const Home = () => {
	return (
		<div className='mt-[150px]'>
			<Search />
			<Modal />

			<Cards/>
		
		</div>
	)
}

export default Home
