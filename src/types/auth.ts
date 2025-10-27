export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface OTPVerification {
  email: string
  otp: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  otpStep: boolean
  tempEmail: string | null
}