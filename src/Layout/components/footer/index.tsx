import { Link } from 'react-router-dom'
import { Facebook, Instagram, Send, Youtube } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer() {
	const { t } = useTranslation()

	return (
		<footer className='bg-[#D56A42] text-white py-10 mt-[50px]'>
			<div className='max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
				<div className='text-center sm:text-left'>
					<Link to='/'>
						<img
							src='/logo.png'
							alt='Fndedu Logo'
							className='w-28 sm:w-36 h-auto mx-auto sm:mx-0 rounded-full bg-white p-1 shadow'
						/>
					</Link>
				</div>

				<div>
					<h3 className='font-semibold mb-2 text-center md:text-start text-[18px]'>
						{t('footer.pages')}
					</h3>
					<ul className='space-y-1 text-sm text-center md:text-start'>
						<li><Link to='/' className='hover:underline hover:text-white/90'>{t('footer.home')}</Link></li>
						<li><Link to='/about' className='hover:underline hover:text-white/90'>{t('footer.about')}</Link></li>
						<li><Link to='/centers' className='hover:underline hover:text-white/90'>{t('footer.centers')}</Link></li>
						<li><Link to='/contact' className='hover:underline hover:text-white/90'>{t('footer.contact')}</Link></li>
					</ul>
				</div>

				<div>
					<h3 className='font-semibold mb-2 text-center md:text-start'>
						{t('footer.categories')}
					</h3>
					<ul className='space-y-1 text-sm text-center md:text-start'>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.it')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.english')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.math')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.smm')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.design')}</li>
					</ul>
				</div>

				<div>
					<h3 className='font-semibold mb-2 text-center md:text-start'>
						{t('footer.extra')}
					</h3>
					<ul className='space-y-1 text-sm text-center md:text-start'>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.reviews')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.projects')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.marketing')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.sat')}</li>
						<li className='hover:text-white/90 cursor-pointer'>{t('footer.business')}</li>
					</ul>
				</div>
			</div>

			<div className='border-t border-white/30 mt-8 pt-4'>
				<div className='max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
					<p className='text-sm text-white/90'>
						© 2025 Fndedu. {t('footer.rights')}
					</p>
					<div className='flex space-x-4'>
						<a href='#' className='hover:text-white/90 transition-transform hover:scale-110'>
							<Facebook className='w-5 h-5' />
						</a>
						<a href='#' className='hover:text-white/90 transition-transform hover:scale-110'>
							<Instagram className='w-5 h-5' />
						</a>
						<a href='#' className='hover:text-white/90 transition-transform hover:scale-110'>
							<Send className='w-5 h-5' />
						</a>
						<a href='#' className='hover:text-white/90 transition-transform hover:scale-110'>
							<Youtube className='w-5 h-5' />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
