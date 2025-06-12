
import { API } from '@/hooks/useApi'
import { useAuth } from '@/store/useAuth'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export type LikedCenter = {
	id: number
	centerId: number
}

export const useLikes = () => {
	const { accessToken } = useAuth()
	const queryClient = useQueryClient()

	const getLikes = async (): Promise<LikedCenter[]> => {
		const res = await axios.get(`${API}/liked`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
		return res?.data?.data || []
	}

	const { data: likedData = [] } = useQuery<LikedCenter[]>({
		queryKey: ['getLike'],
		queryFn: getLikes,
		enabled: !!accessToken,
		retry: false,
	})

	const isLiked = (centerId: number) => {
		return likedData.some((like) => like.centerId === centerId)
	}

	const toggleLike = async (centerId: number) => {
		const likedItem = likedData.find((item) => item.centerId === centerId)

		if (likedItem) {
			await axios.delete(`${API}/liked/${likedItem.id}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
		} else {
			await axios.post(`${API}/liked`, { centerId }, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
		}

		queryClient.invalidateQueries({ queryKey: ['getLike'] })
	}

	return { isLiked, toggleLike }
}
