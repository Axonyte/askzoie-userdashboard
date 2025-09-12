import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/config/apiClient'
import { JwtUserPayload } from '@/types/auth'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    name: string
}

export interface AuthResponse {
    id: string
    email: string
    name: string
    accountStatus: string
    accessToken: string
    createdAt: string
}

export class AuthService {
    private static instance: AuthService

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    /**
     * Decode JWT token and extract user payload
     */
    private decodeJwtToken(token: string): JwtUserPayload {
        try {
            return jwtDecode<JwtUserPayload>(token)
        } catch (error) {
            console.error('Failed to decode JWT token:', error)
            throw new Error('Invalid token format')
        }
    }

    /**
     * Extract user data from JWT payload
     */
    private extractUserFromToken(token: string): JwtUserPayload {
        const payload = this.decodeJwtToken(token)

        return payload
    }

    /**
     * Login user with email and password
     */

    login() {
        const navigate = useNavigate()
        try {
            return useMutation<
                any,
                Error,
                { email: string; password: string },
                unknown
            >({
                mutationFn: async (credentials) => {
                    const response = (
                        await api.post('/auth/login', credentials)
                    ).data

                    // Store the token and user data
                    const { setAccessToken, setUser } =
                        useAuthStore.getState().auth

                    setAccessToken(response.accessToken)
                    const user = this.extractUserFromToken(response.accessToken)
                    setUser(user)

                    toast.success('Login successful!')

                    return response
                },
                onSuccess: () => {
                    // Navigate to dashboard after successful login
                    navigate({ to: '/' })
                },
            })
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                'Login failed. Please try again.'
            toast.error(errorMessage)
            throw error
        }
    }

    /**
     * Register new user
     */
    register() {
        try {
            const navigate = useNavigate()
            return useMutation<
                any,
                Error,
                { email: string; password: string },
                unknown
            >({
                mutationFn: async (credentials) => {
                    const response = (
                        await api.post('/auth/register', credentials)
                    ).data

                    // Store the token and user data
                    const { setAccessToken, setUser } =
                        useAuthStore.getState().auth

                    setAccessToken(response.accessToken)
                    const user = this.extractUserFromToken(response.accessToken)
                    setUser(user)

                    toast.success('Registration successful!')

                    return response
                },
                onSuccess: () => {
                    // Navigate to dashboard after successful login
                    navigate({ to: '/' })
                },
            })
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                'Registration failed. Please try again.'
            toast.error(errorMessage)
            throw error
        }
    }

    /**
     * Logout user
     */
    logout(): void {
        const { reset } = useAuthStore.getState().auth
        reset()
        toast.success('Logged out successfully!')
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const { accessToken } = useAuthStore.getState().auth
        return !!accessToken
    }

    /**
     * Get current user data
     */
    getCurrentUser() {
        const { user } = useAuthStore.getState().auth
        return user
    }

    /**
     * Get access token
     */
    getAccessToken(): string {
        const { accessToken } = useAuthStore.getState().auth
        return accessToken
    }

    /**
     * Initialize user data from existing token (useful on app startup)
     */
    initializeFromToken(): boolean {
        const { accessToken, setUser } = useAuthStore.getState().auth

        if (!accessToken) {
            return false
        }

        try {
            const userData = this.extractUserFromToken(accessToken)

            // Check if token is expired
            if (userData.exp ? userData.exp * 1000 < Date.now() : true) {
                this.logout()
                return false
            }

            setUser(userData)
            return true
        } catch (error) {
            console.error('Failed to initialize from token:', error)
            this.logout()
            return false
        }
    }
}

// Export singleton instance
export const authService = AuthService.getInstance()
