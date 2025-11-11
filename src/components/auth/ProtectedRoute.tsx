import React, { useEffect } from 'react'

import { Spin } from 'antd'
import { useAuthStore } from '../../store/authStore'
import LoginPage from '../../pages/LoginPage'
import OTPPage from '../../pages/OTPPage'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoading, otpStep, tempEmail, isAuthenticated, user, checkAuth } = useAuthStore()

  useEffect(() => {
    // Check authentication on mount (when page is refreshed or opened)
    checkAuth()
  }, [checkAuth])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-4 text-gray-600">
            Loading...
          </div>
        </div>
      </div>
    )
  }

  // Show OTP page if user needs to verify OTP
  if (otpStep && tempEmail) {
    return <OTPPage />
  }

  // Show login page if user is not authenticated
  if (!isAuthenticated || !user) {
    return <LoginPage />
  }

  // User is authenticated, show protected content
  return <>{children}</>
}

export default ProtectedRoute