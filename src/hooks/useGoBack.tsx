// components/ui/GoBack.tsx
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface GoBackProps {
	to?: string
	text?: string
	className?: string
}

const GoBack = ({ to = '/', text = 'Markazga qaytish', className = '' }: GoBackProps) => {
		const { t } = useTranslation()
	
	return (
		<Link
			to={to}
			className={`flex items-center gap-[5px] text-[#D56A42] text-[20px] font-medium hover:underline transition-all ${className}`}
		>
			<ArrowLeft className="w-[20px] h-[20px]" />
			{t(text)}
		</Link>
	)
}

export default GoBack
