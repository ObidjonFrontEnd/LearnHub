import { create } from 'zustand'

type NotificationType = 'success' | 'error' | 'default'

interface NotificationState {
  message: string | null
  show: boolean
  type: NotificationType
  setNotification: (msg: string, type?: NotificationType) => void
  clearNotification: () => void
}

export const useNotification = create<NotificationState>((set) => ({
  message: null,
  show: false,
  type: 'default',
  setNotification: (msg, type = 'default') => set({ message: msg, show: true, type }),
  clearNotification: () => set({ message: null, show: false, type: 'default' }),
}))
