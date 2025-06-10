import { useMenu } from '@/store/isMenu'
import { useAuth } from '@/store/useAuth'
import { useUserStore } from '@/store/userData'
import { CalendarFold, CloudUpload, Heart, House, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink, useNavigate } from 'react-router-dom'


const MenuBar = () => {
		const { isOpen, toggleMenu , closeMenu } = useMenu();
		const [ , setLang]=useState<string>("uz")
		const { t, i18n } = useTranslation();
		const navigate = useNavigate()
		const { accessToken } = useAuth()
		const {user} = useUserStore()

		useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth > 1024) {
        closeMenu()
      }
    };

    checkWidth(); 

    window.addEventListener("resize", checkWidth); 

    return () => window.removeEventListener("resize", checkWidth);
  }, []);
		

	const changeLang = (lang: string) => {
		setLang(lang)
    i18n.changeLanguage(lang);
  };
	
	return (
		<section className={`${isOpen ? "translate-x-[0%]" : "-translate-x-[200%]"} duration-[0.3s] fixed right-0 top-0 z-50 w-full h-full bg-white dark:bg-gray-800 flex justify-center items-center pt-[50px] px-[25px] lg:hidden`} >
				
				<div className="absolute right-[15px] top-[35px]" onClick={toggleMenu}>
					<X />
				</div>


					<div className={`${accessToken ? "flex-col-reverse" : "flex-col"} w-full text-center flex  h-[80vh]  justify-between`}>
						<select defaultValue={""} onChange={(e)=>{changeLang(e.target.value)}} className='dark:bg-[#D56A42] px-[5px] rounded-[10px]'>
							<option value="" className='dark:text-black  bg-gray-400 text-white'  disabled>
								{t("Tilni tanlang")}
							</option>
							<option value="uz" className='dark:text-black dark:bg-white' >
								Uz
							</option>
							<option value="ru" className='dark:text-black dark:bg-white'>
								Ru
							</option>
							<option value="en" className='dark:text-black dark:bg-white'>
								En
							</option>
					</select>


					<ul className='flex-col flex  items-center gap-[20px] font-bold text-[20px]'>
						<li>
							<NavLink
								to={'/'}
								className={'flex items-center gap-[5px] hover:text-[#D56A42]'}
								onClick={closeMenu}
							>
								<House />
								{t('Bosh Sahifa')}
							</NavLink>
						</li>
						<li>
							<NavLink
								to={'/resurlar'}
								className={'flex items-center gap-[5px] hover:text-[#D56A42]'}
								onClick={closeMenu}

							>
								<CloudUpload />
								{t('Resusrlar')}
							</NavLink>
						</li>
						<li className={`${accessToken ? '' : 'hidden'}`}>
							<NavLink
								to={'/sevimli'}
								className={'flex items-center gap-[5px] hover:text-[#D56A42]'}
								onClick={closeMenu}

							>
								<Heart />
								{t('Sevimli')}
							</NavLink>
						</li>

						<li className={`${accessToken ? '' : 'hidden'}`}>
							<NavLink
								to={'/navbat'}
								className={`flex items-center gap-[5px] hover:text-[#D56A42]`}
								onClick={closeMenu}

							>
								<CalendarFold />
								{t('Navbatlar')}
							</NavLink>
						</li>

						
						<li className={`${user?.role ? "" : "hidden"}`}>	
							<NavLink to={'seo'}
							className={`flex items-center gap-[5px] hover:text-[#D56A42]`}  
							onClick={closeMenu} >
									{t("SEO boshqaruv paneli")}
							</NavLink>
						</li>
					</ul>

					<div className='flex flex-col gap-[10px] w-full'>
					
						<button className={`${accessToken ? "hidden" : ""} relative overflow-hidden w-full py-[10px] rounded-xl text-[#D56A42] border border-[#D56A42] font-semibold bg-transparent group transition-colors duration-300 cursor-pointer`} onClick={()=>{navigate("/login"); closeMenu()}}>
							<span className='relative z-10 transition-colors duration-300 group-hover:text-white'>
								{t("Login")}
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

						<button className={`${accessToken ? "hidden" : ""} relative overflow-hidden px-6 py-[10px] rounded-xl text-white bg-[#D56A42] border border-[#D56A42] font-semibold  group transition-colors duration-300 cursor-pointer`}  onClick={()=>{navigate("/register"); closeMenu()}}>
							<span className='relative z-10 transition-colors duration-300 group-hover:text-[#D56A42]'>
								{t("Register")}
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
		</section>
	)
}

export default MenuBar
