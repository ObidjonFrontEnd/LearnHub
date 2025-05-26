import { useNotification } from '@/store/useNotification'
import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'

export const NotificationHandler = () => {
	const { message, show, type, clearNotification } = useNotification()

	useEffect(() => {
		if (show && message) {
			if (type === 'success') {
				toast.success(message, {
					closeButton: true,
					position: 'top-right',
					onDismiss: clearNotification,
					style: {
						padding: '12px 16px',
						margin: '8px',
						borderRadius: '8px',
						backgroundColor: '#DCFCE7',
						color: '#16A34A',
					},
				})
			} else if (type === 'error') {
				toast.error(message, {
					closeButton: true,
					position: 'top-right',
					onDismiss: clearNotification,
					style: {
						padding: '12px 16px',
						margin: '8px',
						borderRadius: '8px',
						backgroundColor: '#FEE2E2',
						color: '#DC2626',
					},
				})
			} else {
				toast(message, {
					closeButton: true,
					position: 'top-right',
					onDismiss: clearNotification,
					style: {
						padding: '12px 16px',
						margin: '8px',
						borderRadius: '8px',
					},
				})
			}
		}
	}, [show, message, type, clearNotification])

	return (
		<Toaster
			position='top-right'
			closeButton
			toastOptions={{
				style: {
					padding: '12px 16px',
					margin: '8px',
					borderRadius: '8px',
				},
			}}
		/>
	)
}
