import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
import type { User, LoginCredentials, OTPVerification } from '../types/auth'

interface AuthStore {
  // State
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  otpStep: boolean
  tempEmail: string | null
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setOtpStep: (otpStep: boolean, email?: string) => void
  clearError: () => void
  
  // Auth methods
  login: (credentials: LoginCredentials) => Promise<void>
  verifyOTP: (verification: OTPVerification) => Promise<void>
  resendOTP: () => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  resetOtpStep: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: true,
      otpStep: false,
      tempEmail: null,
      error: null,

      // Basic setters
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setOtpStep: (otpStep, email) => set({ 
        otpStep, 
        tempEmail: email || null,
        isLoading: false 
      }),
      
      clearError: () => set({ error: null }),
      
      resetOtpStep: () => set({ 
        otpStep: false, 
        tempEmail: null,
        isLoading: false 
      }),

      // Login method
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null })
          
          const result = await authService.login(credentials)
          
          if (result.success) {
            set({ 
              otpStep: result.requiresOTP,
              tempEmail: credentials.email,
              isLoading: false
            })
          } else {
            set({ 
              error: result.message || 'Login failed',
              isLoading: false 
            })
          }
        } catch (err) {
          set({ 
            error: 'An unexpected error occurred',
            isLoading: false 
          })
        }
      },

      // Verify OTP method
      verifyOTP: async (verification) => {
        try {
          set({ isLoading: true, error: null })
          
          const result = await authService.verifyOTP(verification)
          
          if (result.success && result.user) {
            set({ 
              user: result.user,
              isAuthenticated: true,
              isLoading: false,
              otpStep: false,
              tempEmail: null
            })
          } else {
            set({ 
              error: result.message || 'OTP verification failed',
              isLoading: false 
            })
          }
        } catch (err) {
          set({ 
            error: 'An unexpected error occurred',
            isLoading: false 
          })
        }
      },

      // Resend OTP method
      resendOTP: async () => {
        const { tempEmail } = get()
        if (!tempEmail) return
        
        try {
          set({ isLoading: true, error: null })
          
          const result = await authService.resendOTP(tempEmail)
          
          if (!result.success) {
            set({ error: result.message })
          }
          
          set({ isLoading: false })
        } catch (err) {
          set({ 
            error: 'Failed to resend OTP',
            isLoading: false 
          })
        }
      },

      // Logout method
      logout: async () => {
        try {
          await authService.logout()
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false,
            otpStep: false,
            tempEmail: null,
            error: null
          })
        } catch (err) {
          set({ error: 'Logout failed' })
        }
      },

      // Check authentication
      checkAuth: async () => {
        try {
          set({ isLoading: true })
          
          const result = await authService.checkAuth()
          
          if (result.success && result.user) {
            set({ 
              user: result.user,
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({ 
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (err) {
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)