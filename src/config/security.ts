// Security Configuration - OWASP Best Practices

export const SECURITY_CONFIG = {
  // A04: Insecure Design - Rate Limiting
  rateLimit: {
    maxLoginAttempts: 5,
    maxOTPAttempts: 3,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    otpRetryDelay: 60 * 1000, // 1 minute between resend
  },

  // A02: Cryptographic Failures - Token & Session
  session: {
    tokenExpiry: 30 * 60 * 1000, // 30 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
    otpExpiry: 2 * 60 * 1000, // 2 minutes (reduced from 5)
    idleTimeout: 15 * 60 * 1000, // 15 minutes idle
  },

  // A07: Authentication - Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
  },

  // A04: Insecure Design - OTP Settings
  otp: {
    length: 6,
    type: 'numeric' as const,
    maxAttempts: 3,
    expiryMinutes: 2,
  },

  // A05: Security Headers
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },

  // Content Security Policy
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"],
  },
}

// Common weak passwords to prevent
export const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'passw0rd', 'shadow', '123123', '654321',
  'admin', 'admin123', 'user123', 'password123'
]
