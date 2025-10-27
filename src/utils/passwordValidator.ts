// A07: Authentication Failures - Password Validation
import { SECURITY_CONFIG, COMMON_PASSWORDS } from '../config/security'

export interface PasswordValidationResult {
  isValid: boolean
  errors: string[]
  strength: 'weak' | 'medium' | 'strong'
}

/**
 * Validate password against security policy
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = []
  const config = SECURITY_CONFIG.password

  // Check length
  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long`)
  }

  // Check uppercase
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  // Check lowercase
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  // Check numbers
  if (config.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  // Check special characters
  if (config.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  // Check common passwords
  if (config.preventCommonPasswords && COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger password')
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  const strengthScore = calculatePasswordStrength(password)
  
  if (strengthScore >= 4) strength = 'strong'
  else if (strengthScore >= 3) strength = 'medium'

  return {
    isValid: errors.length === 0,
    errors,
    strength
  }
}

/**
 * Calculate password strength score
 */
function calculatePasswordStrength(password: string): number {
  let score = 0

  // Length bonus
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  // Character variety
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++

  // Patterns penalty
  if (/(.)\1{2,}/.test(password)) score-- // Repeated characters
  if (/^[a-zA-Z]+$/.test(password)) score-- // Only letters
  if (/^\d+$/.test(password)) score-- // Only numbers

  return Math.max(0, score)
}

/**
 * Check if password has been compromised (in production, use HaveIBeenPwned API)
 */
export async function checkPasswordBreach(password: string): Promise<boolean> {
  // In production, integrate with HaveIBeenPwned API
  // https://haveibeenpwned.com/API/v3
  
  // For now, just check against common passwords
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}

/**
 * Generate password strength indicator
 */
export function getPasswordStrengthIndicator(password: string): {
  score: number
  label: string
  color: string
} {
  const score = calculatePasswordStrength(password)
  
  if (score <= 2) return { score, label: 'Weak', color: '#ff4d4f' }
  if (score <= 4) return { score, label: 'Medium', color: '#faad14' }
  return { score, label: 'Strong', color: '#52c41a' }
}
