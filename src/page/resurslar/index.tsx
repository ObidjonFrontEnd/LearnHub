
import GetResurses from './components/getResurses'

import Filter from './components/filter&search'
import AddResourceDialog from './components/addResurses'


const Resurses = () => {
	return (
		<section className='mt-[150px]  px-[15px]'>
				<Filter/>
				<div className="text-center mb-[50px]">
					<AddResourceDialog/>
				</div>
				<GetResurses/>
				
		</section>
	)
}

export default Resurses