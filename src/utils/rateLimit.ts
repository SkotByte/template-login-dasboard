// A04: Insecure Design - Rate Limiting Implementation
import { SECURITY_CONFIG } from '../config/security'

interface RateLimitEntry {
  attempts: number
  lockedUntil?: number
  lastAttempt: number
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>()

  /**
   * Check if action is allowed
   */
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now()
    const entry = this.storage.get(key)

    if (!entry) {
      this.storage.set(key, { attempts: 1, lastAttempt: now })
      return true
    }

    // Check if account is locked
    if (entry.lockedUntil && entry.lockedUntil > now) {
      return false
    }

    // Reset if window expired
    if (now - entry.lastAttempt > windowMs) {
      this.storage.set(key, { attempts: 1, lastAttempt: now })
      return true
    }

    // Check attempts
    if (entry.attempts >= maxAttempts) {
      // Lock the account
      entry.lockedUntil = now + SECURITY_CONFIG.rateLimit.lockoutDuration
      this.storage.set(key, entry)
      return false
    }

    // Increment attempts
    entry.attempts++
    entry.lastAttempt = now
    this.storage.set(key, entry)
    return true
  }

  /**
   * Record failed attempt
   */
  recordFailure(key: string): void {
    const entry = this.storage.get(key)
    if (entry) {
      entry.attempts++
      this.storage.set(key, entry)
    } else {
      this.storage.set(key, { attempts: 1, lastAttempt: Date.now() })
    }
  }

  /**
   * Reset attempts on success
   */
  reset(key: string): void {
    this.storage.delete(key)
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string, maxAttempts: number): number {
    const entry = this.storage.get(key)
    if (!entry) return maxAttempts
    return Math.max(0, maxAttempts - entry.attempts)
  }

  /**
   * Get time until unlock
   */
  getTimeUntilUnlock(key: string): number {
    const entry = this.storage.get(key)
    if (!entry?.lockedUntil) return 0
    return Math.max(0, entry.lockedUntil - Date.now())
  }

  /**
   * Check if account is locked
   */
  isLocked(key: string): boolean {
    const entry = this.storage.get(key)
    if (!entry?.lockedUntil) return false
    return entry.lockedUntil > Date.now()
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now()
    const expireTime = 24 * 60 * 60 * 1000 // 24 hours

    for (const [key, entry] of this.storage.entries()) {
      if (now - entry.lastAttempt > expireTime) {
        this.storage.delete(key)
      }
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()

// Cleanup every hour
setInterval(() => rateLimiter.cleanup(), 60 * 60 * 1000)
