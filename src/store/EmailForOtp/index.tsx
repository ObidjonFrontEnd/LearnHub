import { create } from 'zustand'

interface EmailOtpState {
  emailOtp: string
  setEmailOtp: (email: string) => void
}

export const useEmailOtpStore = create<EmailOtpState>((set) => ({
  emailOtp: '',
  setEmailOtp: (email) => set({ emailOtp: email }),
}))
