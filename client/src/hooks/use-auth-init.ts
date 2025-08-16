import { useEffect } from 'react'
import { authService } from '@/features/auth/services/AuthService'

/**
 * Hook to initialize authentication state from existing token
 * Should be called once on app startup
 */
export const useAuthInit = () => {
  useEffect(() => {
    // Try to initialize user data from existing token
    const success = authService.initializeFromToken()
    
    // if (success) {
    //   console.log('User authenticated from existing token')
    // } else {
    //   console.log('No valid token found, user needs to login')
    // }
  }, [])
}
