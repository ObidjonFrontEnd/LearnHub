import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
	isDark: boolean
	toggleTheme: () => void
}

export const useTheme = create<ThemeState>()(
	persist(
		(set, get) => ({
			isDark: false,

			toggleTheme: () => {
				const newTheme = !get().isDark
				document.documentElement.classList.toggle('dark', newTheme)
				set({ isDark: newTheme })
			},

			init: () => {
				const isDarkStored = get().isDark
				document.documentElement.classList.toggle('dark', isDarkStored)
			},
		}),
		{
			name: 'theme-storage',
			
			onRehydrateStorage: () => state => {
				if (state) {
					document.documentElement.classList.toggle('dark', state.isDark)
				}
			},
		}
	)
)
