// A07: Authentication - Secure Session Management
import { SECURITY_CONFIG } from '../config/security'
import { generateSecureToken } from './crypto'

interface Session {
  token: string
  userId: string
  createdAt: number
  lastActivity: number
  expiresAt: number
  ipAddress?: string
  userAgent?: string
}

class SessionManager {
  private sessions = new Map<string, Session>()
  private userSessions = new Map<string, Set<string>>() // userId -> Set of tokens

  /**
   * Create new session
   */
  createSession(userId: string, metadata?: { ipAddress?: string; userAgent?: string }): string {
    const token = generateSecureToken(32)
    const now = Date.now()
    
    const session: Session = {
      token,
      userId,
      createdAt: now,
      lastActivity: now,
      expiresAt: now + SECURITY_CONFIG.session.tokenExpiry,
      ...metadata
    }

    this.sessions.set(token, session)

    // Track user sessions
    if (!this.userSessions.has(userId)) {
      this.userSessions.set(userId, new Set())
    }
    this.userSessions.get(userId)!.add(token)

    // Auto-cleanup on expiry
    setTimeout(() => this.removeSession(token), SECURITY_CONFIG.session.tokenExpiry)

    return token
  }

  /**
   * Validate session and check for idle timeout
   */
  validateSession(token: string): { valid: boolean; userId?: string; reason?: string } {
    const session = this.sessions.get(token)

    if (!session) {
      return { valid: false, reason: 'Session not found' }
    }

    const now = Date.now()

    // Check expiry
    if (now > session.expiresAt) {
      this.removeSession(token)
      return { valid: false, reason: 'Session expired' }
    }

    // Check idle timeout
    if (now - session.lastActivity > SECURITY_CONFIG.session.idleTimeout) {
      this.removeSession(token)
      return { valid: false, reason: 'Session idle timeout' }
    }

    // Update last activity
    session.lastActivity = now
    this.sessions.set(token, session)

    return { valid: true, userId: session.userId }
  }

  /**
   * Refresh session expiry
   */
  refreshSession(token: string): boolean {
    const session = this.sessions.get(token)
    if (!session) return false

    session.expiresAt = Date.now() + SECURITY_CONFIG.session.tokenExpiry
    session.lastActivity = Date.now()
    this.sessions.set(token, session)
    
    return true
  }

  /**
   * Remove session (logout)
   */
  removeSession(token: string): void {
    const session = this.sessions.get(token)
    if (session) {
      this.sessions.delete(token)
      
      const userTokens = this.userSessions.get(session.userId)
      if (userTokens) {
        userTokens.delete(token)
        if (userTokens.size === 0) {
          this.userSessions.delete(session.userId)
        }
      }
    }
  }

  /**
   * Remove all sessions for a user
   */
  removeAllUserSessions(userId: string): void {
    const tokens = this.userSessions.get(userId)
    if (tokens) {
      tokens.forEach(token => this.sessions.delete(token))
      this.userSessions.delete(userId)
    }
  }

  /**
   * Get active sessions for user
   */
  getUserSessions(userId: string): Session[] {
    const tokens = this.userSessions.get(userId)
    if (!tokens) return []

    return Array.from(tokens)
      .map(token => this.sessions.get(token))
      .filter((s): s is Session => s !== undefined)
  }

  /**
   * Get session info
   */
  getSession(token: string): Session | undefined {
    return this.sessions.get(token)
  }

  /**
   * Cleanup expired sessions
   */
  cleanup(): void {
    const now = Date.now()
    
    for (const [token, session] of this.sessions.entries()) {
      if (now > session.expiresAt || 
          now - session.lastActivity > SECURITY_CONFIG.session.idleTimeout) {
        this.removeSession(token)
      }
    }
  }
}

// Export singleton
export const sessionManager = new SessionManager()

// Cleanup every 5 minutes
setInterval(() => sessionManager.cleanup(), 5 * 60 * 1000)
