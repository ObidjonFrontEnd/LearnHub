import { useMenu } from '@/store/isMenu'
import {
	CalendarFold,
	CloudUpload,
	Heart,
	House,
	Menu,
	Moon,
	Sun,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import MenuBar from './menuModal'
import { useTheme } from '@/store/useThem'
import { useAuth } from '@/store/useAuth'
import ProfileMenu from './prifleMenu'
import { useUserStore } from '@/store/userData'

const Header = () => {
	const [ ,setLang] = useState<string>('uz')
	const { t, i18n } = useTranslation()
	const { isOpen, toggleMenu } = useMenu()
	console.log(isOpen)
	const { isDark, toggleTheme } = useTheme()
	const navigate = useNavigate()

	const changeLang = (lang: string) => {
		setLang(lang)
		i18n.changeLanguage(lang)
	}
	const {user} = useUserStore()

	

	const { accessToken } = useAuth()

	return (
		<header className='w-full overflow-x-hidden'>
			<nav className='w-full z-40 fixed top-0 shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.1)] bg-white dark:bg-gray-800'>
				<div className='w-full mx-auto flex justify-between items-center  px-[10px]'>
					<div className='logo w-[100px] h-[100px] gap-[10px] flex items-center justify-center'>
						<div
							className='block lg:hidden hover:text-[#D56A42] duration-[0.3s]'
							onClick={toggleMenu}
						>
							<Menu />
						</div>
						<Link to={'/'}>
							<img src='/logo.png' alt='logo' className='w-full h-full' />
						</Link>
					</div>

					<ul className=' hidden lg:flex items-center gap-[20px] font-bold text-[20px]'>
						<li>
							<NavLink
								to={'/'}
								className={'flex items-center gap-[5px] hover:text-[#D56A42]'}
							>
								<House />
								{t('Bosh Sahifa')}
							</NavLink>
						</li>
						<li>
							<NavLink
								to={'/resurlar'}
								className={'flex items-center gap-[5px] hover:text-[#D56A42]'}
							>
								<CloudUpload />
								{t('Resusrlar')}
							</NavLink>
						</li>
						<li className={`${accessToken ? '' : 'hidden'}`}>
							<NavLink
								to={'/sevimli'}
								className={'flex items-center gap-[5px] hover:text-[#D56A42]'}
							>
								<Heart />
								{t('Sevimli')}
							</NavLink>
						</li>

						<li className={`${accessToken ? '' : 'hidden'}`}>
							<NavLink
								to={'/navbat'}
								className={`flex items-center gap-[5px] hover:text-[#D56A42]`}
							>
								<CalendarFold />
								{t('Navbatlar')}
							</NavLink>
						</li>

						
						<li className={`${user?.role ? "" : "hidden"}`}>
							<NavLink to={'seo'}>
									{t("SEO boshqaruv paneli")}
							</NavLink>
						</li>
					</ul>

					<div className='flex  md:gap-[10px]'>
						<button onClick={toggleTheme}>
							{isDark ? <Sun className='text-[#D56A42]' /> : <Moon />}
						</button>
						

						<select
							defaultValue={""}
							onChange={e => {
								changeLang(e.target.value)
							}}
							className='hidden md:block'
						>
							<option value="" className='dark:text-black '  disabled>
								{t("Tilni tanlang")}
							</option>
							<option value='uz' className='dark:text-black'>
								Uz
							</option>
							<option value='ru' className='dark:text-black'>
								Ru
							</option>
							<option value='en' className='dark:text-black'>
								En
							</option>
						</select>


						{ accessToken ? 	<ProfileMenu/> : null}

						<button
							className={`${
								accessToken ? 'hidden' : 'hidden md:block'
							} relative overflow-hidden px-6 py-[10px] rounded-xl text-[#D56A42] border border-[#D56A42] font-semibold bg-transparent group transition-colors duration-300 cursor-pointer  `}
							onClick={() => {
								navigate('/login')
							}}
						>
							<span className='relative z-10 transition-colors duration-300 group-hover:text-white'>
								{t('Login')}
							</span>

							<span className='absolute inset-0 w-full h-full translate-y-[100%] group-hover:translate-y-[0] transition-transform duration-700 ease-out z-0 pointer-events-none'>
								<svg
									className='absolute inset-0 w-[200%] h-full'
									viewBox='0 0 1200 100'
									preserveAspectRatio='none'
								>
									<path
										d='M0,10 C150,40 350,0 500,20 C650,40 850,0 1200,10 L1200,100 L0,100 Z'
										fill='#D56A42'
										style={{
											opacity: 0.6,
											animation: 'wave1 12s linear infinite',
										}}
									/>
									<path
										d='M0,20 C250,0 450,40 700,10 C950,40 1050,20 1200,20 L1200,100 L0,100 Z'
										fill='#D56A42'
										style={{
											opacity: 0.4,
											animation: 'wave2 10s linear infinite',
										}}
									/>
									<path
										d='M0,40 C350,10 450,40 650,30 C850,20 950,50 1200,40 L1200,100 L0,100 Z'
										fill='#D56A42'
										style={{
											opacity: 0.8,
											animation: 'wave3 8s linear infinite',
										}}
									/>
								</svg>
							</span>
						</button>

						<button
							className={`${
								accessToken ? 'hidden' : 'hidden md:block'
							} relative overflow-hidden px-6 py-[10px] rounded-xl text-white bg-[#D56A42] border border-[#D56A42] font-semibold  group transition-colors duration-300 cursor-pointer `}
							onClick={() => {
								navigate('/register')
							}}
						>
							<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42]'>
								{t('Register')}
							</span>

							<span className='absolute inset-0 w-full h-full translate-y-[100%] group-hover:translate-y-[0] transition-transform duration-700 ease-out z-0 pointer-events-none'>
								<svg
									className='absolute inset-0 w-[200%] h-full'
									viewBox='0 0 1200 100'
									preserveAspectRatio='none'
								>
									<path
										d='M0,10 C150,40 350,0 500,20 C650,40 850,0 1200,10 L1200,100 L0,100 Z'
										fill='#ffffff'
										style={{
											opacity: 0.6,
											animation: 'wave1 12s linear infinite',
										}}
									/>
									<path
										d='M0,20 C250,0 450,40 700,10 C950,40 1050,20 1200,20 L1200,100 L0,100 Z'
										fill='#ffffff'
										style={{
											opacity: 0.4,
											animation: 'wave2 10s linear infinite',
										}}
									/>
									<path
										d='M0,40 C350,10 450,40 650,30 C850,20 950,50 1200,40 L1200,100 L0,100 Z'
										fill='#ffffff'
										style={{
											opacity: 0.8,
											animation: 'wave3 8s linear infinite',
										}}
									/>
								</svg>
							</span>
						</button>
					</div>
				</div>
			</nav>
			<MenuBar />
		</header>
	)
}

export default Header
