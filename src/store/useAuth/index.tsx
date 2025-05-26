import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  clearTokens: () => void
  isAuthenticated: () => boolean
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
      isAuthenticated: () => !!get().accessToken,
    }),
    {
      name: 'auth-storage',
    }
  )
)