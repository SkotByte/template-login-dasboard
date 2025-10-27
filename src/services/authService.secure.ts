// Secure Authentication Service - OWASP Compliant
import type { User, LoginCredentials, OTPVerification } from '../types/auth'
import { hashPassword, generateSecureOTP, secureCompare, isValidEmail } from '../utils/crypto'
import { rateLimiter } from '../utils/rateLimit'
import { sessionManager } from '../utils/sessionManager'
import { SECURITY_CONFIG } from '../config/security'

// Mock users database (with hashed passwords in production)
const MOCK_USERS: Array<User & { passwordHash: string }> = [
  {
    id: '1',
    email: 'admin@example.com',
    passwordHash: await hashPassword('Admin@123'), // Strong password
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://via.placeholder.com/100'
  },
  {
    id: '2',
    email: 'user@example.com',
    passwordHash: await hashPassword('User@123'), // Strong password
    name: 'Regular User',
    role: 'user',
    avatar: 'https://via.placeholder.com/100'
  }
]

// Secure OTP storage with enhanced security
interface OTPEntry {
  otp: string
  expires: number
  attempts: number
  createdAt: number
}

const OTP_STORAGE = new Map<string, OTPEntry>()

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  /**
   * A07: Authentication - Secure Login with Rate Limiting
   */
  async login(credentials: LoginCredentials): Promise<{ 
    success: boolean
    requiresOTP: boolean
    message?: string
    remainingAttempts?: number
    lockedUntil?: number
  }> {
    await delay(1000)
    
    // A03: Injection - Validate and sanitize input
    if (!isValidEmail(credentials.email)) {
      return {
        success: false,
        requiresOTP: false,
        message: 'Invalid email format'
      }
    }

    // A04: Rate Limiting - Check login attempts
    const rateLimitKey = `login:${credentials.email}`
    if (!rateLimiter.isAllowed(rateLimitKey, SECURITY_CONFIG.rateLimit.maxLoginAttempts, 15 * 60 * 1000)) {
      const timeUntilUnlock = rateLimiter.getTimeUntilUnlock(rateLimitKey)
      return {
        success: false,
        requiresOTP: false,
        message: `Account locked. Too many failed attempts. Try again in ${Math.ceil(timeUntilUnlock / 60000)} minutes.`,
        lockedUntil: Date.now() + timeUntilUnlock
      }
    }
    
    // Hash the provided password
    const passwordHash = await hashPassword(credentials.password)
    
    // Find user and verify password using constant-time comparison
    const user = MOCK_USERS.find(u => 
      u.email === credentials.email && 
      secureCompare(u.passwordHash, passwordHash)
    )
    
    if (!user) {
      // Record failed attempt
      rateLimiter.recordFailure(rateLimitKey)
      const remaining = rateLimiter.getRemainingAttempts(rateLimitKey, SECURITY_CONFIG.rateLimit.maxLoginAttempts)
      
      return {
        success: false,
        requiresOTP: false,
        message: remaining > 0 
          ? `Invalid credentials. ${remaining} attempts remaining.`
          : 'Account locked due to too many failed attempts.',
        remainingAttempts: remaining
      }
    }
    
    // A02: Cryptographic - Generate cryptographically secure OTP
    const otp = generateSecureOTP(SECURITY_CONFIG.otp.length)
    OTP_STORAGE.set(credentials.email, {
      otp,
      expires: Date.now() + SECURITY_CONFIG.session.otpExpiry,
      attempts: 0,
      createdAt: Date.now()
    })
    
    // In production: Send OTP via SMS/Email with encryption
    console.log(`🔐 OTP for ${credentials.email}: ${otp} (Expires in ${SECURITY_CONFIG.session.otpExpiry / 60000} minutes)`)
    
    // Reset login rate limit on success
    rateLimiter.reset(rateLimitKey)
    
    return {
      success: true,
      requiresOTP: true,
      message: `OTP sent to ${credentials.email}`
    }
  },

  /**
   * A04 & A07: Secure OTP Verification with Attempt Limiting
   */
  async verifyOTP(verification: OTPVerification): Promise<{ 
    success: boolean
    user?: User
    token?: string
    message?: string
    remainingAttempts?: number
  }> {
    await delay(800)
    
    const storedOTP = OTP_STORAGE.get(verification.email)
    
    if (!storedOTP) {
      return {
        success: false,
        message: 'OTP not found or expired. Please request a new one.'
      }
    }
    
    // Check expiry
    if (Date.now() > storedOTP.expires) {
      OTP_STORAGE.delete(verification.email)
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      }
    }
    
    // Check attempts (prevent brute force)
    if (storedOTP.attempts >= SECURITY_CONFIG.otp.maxAttempts) {
      OTP_STORAGE.delete(verification.email)
      return {
        success: false,
        message: `Too many failed OTP attempts. Please login again.`
      }
    }
    
    // Verify OTP using constant-time comparison (prevent timing attacks)
    if (!secureCompare(storedOTP.otp, verification.otp)) {
      storedOTP.attempts++
      OTP_STORAGE.set(verification.email, storedOTP)
      
      const remaining = SECURITY_CONFIG.otp.maxAttempts - storedOTP.attempts
      return {
        success: false,
        message: remaining > 0
          ? `Invalid OTP. ${remaining} attempts remaining.`
          : 'Too many failed attempts. Please login again.',
        remainingAttempts: remaining
      }
    }
    
    // OTP verified successfully
    OTP_STORAGE.delete(verification.email)
    
    const user = MOCK_USERS.find(u => u.email === verification.email)
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    
    // A07: Session Management - Create secure session
    const token = sessionManager.createSession(user.id, {
      ipAddress: 'mock-ip', // In production: get from request
      userAgent: navigator.userAgent
    })
    
    // Store token securely
    localStorage.setItem('auth_token', token)
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    }
  },

  /**
   * A04: Rate Limited OTP Resend
   */
  async resendOTP(email: string): Promise<{ success: boolean; message: string }> {
    await delay(500)
    
    // Rate limit OTP resend
    const rateLimitKey = `otp-resend:${email}`
    if (!rateLimiter.isAllowed(rateLimitKey, 3, SECURITY_CONFIG.rateLimit.otpRetryDelay)) {
      return {
        success: false,
        message: 'Please wait before requesting a new OTP.'
      }
    }
    
    const user = MOCK_USERS.find(u => u.email === email)
    if (!user) {
      return {
        success: false,
        message: 'User not found'
      }
    }
    
    // Generate new secure OTP
    const otp = generateSecureOTP(SECURITY_CONFIG.otp.length)
    OTP_STORAGE.set(email, {
      otp,
      expires: Date.now() + SECURITY_CONFIG.session.otpExpiry,
      attempts: 0,
      createdAt: Date.now()
    })
    
    console.log(`🔐 New OTP for ${email}: ${otp}`)
    
    return {
      success: true,
      message: 'New OTP sent successfully'
    }
  },

  /**
   * A07: Secure Session Validation
   */
  async checkAuth(): Promise<{ success: boolean; user?: User }> {
    await delay(300)
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return { success: false }
    }
    
    // Validate session
    const validation = sessionManager.validateSession(token)
    if (!validation.valid) {
      localStorage.removeItem('auth_token')
      return { success: false }
    }
    
    // Refresh session on activity
    sessionManager.refreshSession(token)
    
    const user = MOCK_USERS.find(u => u.id === validation.userId)
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
  },

  /**
   * Secure Logout - Invalidate session
   */
  async logout(): Promise<void> {
    await delay(200)
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      sessionManager.removeSession(token)
    }
    
    localStorage.removeItem('auth_token')
  },

  /**
   * Get active sessions for user (security monitoring)
   */
  async getUserSessions(userId: string) {
    return sessionManager.getUserSessions(userId)
  },

  /**
   * Revoke all sessions (useful for security breach)
   */
  async revokeAllSessions(userId: string): Promise<void> {
    sessionManager.removeAllUserSessions(userId)
  }
}

// Cleanup expired OTPs every minute
setInterval(() => {
  const now = Date.now()
  for (const [email, entry] of OTP_STORAGE.entries()) {
    if (now > entry.expires) {
      OTP_STORAGE.delete(email)
    }
  }
}, 60 * 1000)
