import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const isRedirectingRef = useRef(false) // Prevent redirect loops

    const forceLogout = () => {
        if (isRedirectingRef.current) return; // Already redirecting, skip

        isRedirectingRef.current = true;
        console.log('Force logout - clearing all auth state');

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('pendingUser');
        localStorage.removeItem('pendingVerificationEmail');
        setUser(null);

        // Use replace to avoid stacking URLs
        router.replace('/login');

        setTimeout(() => {
            isRedirectingRef.current = false;
        }, 2000);
    };

    const refreshProfile = async () => {
        try {
            const response = await api.get('/auth/me')
            const updatedUser = response.data.details.user
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            return updatedUser
        } catch (error) {
            console.error('Failed to refresh profile:', error)
            throw error
        }
    }

    useEffect(() => {
        // Initialize auth state from local storage on mount
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem('user')
                const storedToken = localStorage.getItem('accessToken')

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser))
                    // Fetch fresh profile in background to validate
                    try {
                        await refreshProfile()
                    } catch (e) {
                        console.error("Session validation failed on load:", e)
                        localStorage.removeItem('user')
                        localStorage.removeItem('accessToken')
                        setUser(null)
                    }
                }
            } catch (error) {
                console.error('Failed to parse user from local storage:', error)
                localStorage.removeItem('user')
                localStorage.removeItem('accessToken')
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        // Periodic check every 5 minutes
        const intervalId = setInterval(async () => {
            if (localStorage.getItem('accessToken') && !isRedirectingRef.current) {
                try {
                    await refreshProfile()
                    console.log("Periodic session check: OK")
                } catch (error) {
                    console.error("Periodic session check failed - logging out:", error)
                    // If periodic check fails, it means token is invalid
                    // The API interceptor will handle redirect, but we clear state here
                    localStorage.removeItem('accessToken')
                    localStorage.removeItem('user')
                    setUser(null)
                }
            }
        }, 5 * 60 * 1000)

        return () => clearInterval(intervalId)
    }, [])

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData)
            const { user, requiresVerification, email } = response.data.details

            if (requiresVerification) {
                // Email verification required - don't log in yet
                localStorage.setItem('pendingVerificationEmail', email)
                return { ...response.data, requiresVerification: true, email }
            }

            // If no verification required (shouldn't happen now)
            const { accessToken, refreshToken } = response.data.details
            localStorage.setItem('accessToken', accessToken)
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken)
            }
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)

            return response.data
        } catch (error) {
            throw error
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password })
            const { user, accessToken } = response.data.details

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)

            // Redirect to home or previous page
            router.push('/home')
            return response.data
        } catch (error) {
            throw error
        }
    }

    const verifyEmail = async (token, type = 'signup') => {
        try {
            const response = await api.post('/auth/verify-email', { token, type })
            const { user, accessToken } = response.data.details

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken)
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.removeItem('pendingUser')
                setUser(user)
            }

            return response.data
        } catch (error) {
            throw error
        }
    }

    const resendVerification = async (email) => {
        try {
            const response = await api.post('/auth/resend-verification', { email })
            return response.data
        } catch (error) {
            throw error
        }
    }

    const logout = async () => {
        if (isRedirectingRef.current) return;

        try {
            // Optional: Call revoke session endpoint
        } catch (error) {
            console.error("Logout error", error)
        } finally {
            isRedirectingRef.current = true;
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            localStorage.removeItem('pendingUser')
            localStorage.removeItem('pendingVerificationEmail')
            setUser(null)

            // Use replace instead of push to avoid stacking URLs
            router.replace('/login')

            setTimeout(() => {
                isRedirectingRef.current = false;
            }, 1000);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signup,
                login,
                logout,
                forceLogout,
                verifyEmail,
                resendVerification,
                setUser,
                refreshProfile,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
