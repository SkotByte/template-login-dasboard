import type { User, LoginCredentials, OTPVerification } from '../types/auth'

// Mock users database
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://via.placeholder.com/100'
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    avatar: 'https://via.placeholder.com/100'
  }
]

// Mock OTP storage (in real app, this would be server-side)
const OTP_STORAGE = new Map<string, { otp: string; expires: number }>()

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<{ success: boolean; requiresOTP: boolean; message?: string }> {
    await delay(1000) // Simulate API call
    
    const user = MOCK_USERS.find(u => u.email === credentials.email && u.password === credentials.password)
    
    if (!user) {
      return {
        success: false,
        requiresOTP: false,
        message: 'Invalid email or password'
      }
    }
    
    // Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    OTP_STORAGE.set(credentials.email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000 // 5 minutes
    })
    
    // In real app, send OTP via SMS/Email
    console.log(`🔐 OTP for ${credentials.email}: ${otp}`)
    
    return {
      success: true,
      requiresOTP: true,
      message: `OTP sent to ${credentials.email}`
    }
  },
  
  // Verify OTP
  async verifyOTP(verification: OTPVerification): Promise<{ success: boolean; user?: User; message?: string }> {
    await delay(800) // Simulate API call
    
    const storedOTP = OTP_STORAGE.get(verification.email)
    
    if (!storedOTP) {
      return {
        success: false,
        message: 'OTP not found or expired'
      }
    }
    
    if (Date.now() > storedOTP.expires) {
      OTP_STORAGE.delete(verification.email)
      return {
        success: false,
        message: 'OTP has expired'
      }
    }
    
    if (storedOTP.otp !== verification.otp) {
      return {
        success: false,
        message: 'Invalid OTP'
      }
    }
    
    // OTP verified, clean up and return user
    OTP_STORAGE.delete(verification.email)
    const user = MOCK_USERS.find(u => u.email === verification.email)
    
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    
    // Store auth token in localStorage (in real app, use secure cookies)
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, exp: Date.now() + 24 * 60 * 60 * 1000 }))
    localStorage.setItem('auth_token', token)
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    }
  },
  
  // Resend OTP
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    await delay(500)
    
    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    OTP_STORAGE.set(email, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    })
    
    console.log(`🔐 New OTP for ${email}: ${otp}`)
    
    return {
      success: true,
      message: 'New OTP sent successfully'
    }
  },
  
  // Check if user is authenticated
  async checkAuth(): Promise<{ success: boolean; user?: User }> {
    await delay(300)
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return { success: false }
    }
    
    try {
      const decoded = JSON.parse(atob(token))
      if (Date.now() > decoded.exp) {
        localStorage.removeItem('auth_token')
        return { success: false }
      }
      
      const user = MOCK_USERS.find(u => u.id === decoded.userId)
      if (!user) {
        return { success: false }
      }
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar
        }
      }
    } catch {
      localStorage.removeItem('auth_token')
      return { success: false }
    }
  },
  
  // Logout
  async logout(): Promise<void> {
    await delay(200)
    localStorage.removeItem('auth_token')
  }
}