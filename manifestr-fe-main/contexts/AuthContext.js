import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const refreshProfile = async () => {
        try {
            const response = await api.get('/auth/me')
            const updatedUser = response.data.details.user
            localStorage.setItem('user', JSON.stringify(updatedUser))
            setUser(updatedUser)
            return updatedUser
        } catch (error) {
            console.error('Failed to refresh profile:', error)
            // If 401, maybe logout? api.js handles 401 auto logout/refresh.
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
                    // Fetch fresh profile in background to validate logic
                    try {
                        await refreshProfile()
                    } catch (e) {
                        console.error("Session validation failed on load:", e)
                        // If validation fails (and api.js didn't handle it or we want to be safe)
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
        // This validates the user exists and implicitly refreshes the token via api.js interceptor if 401
        const intervalId = setInterval(async () => {
            if (localStorage.getItem('accessToken')) {
                try {
                    await refreshProfile()
                    console.log("Periodic session check: OK")
                } catch (error) {
                    console.error("Periodic session check failed:", error)
                    // No need to redirect here explicitly if api.js handles 401->Redirect
                    // But if it's another error, we might just log it
                }
            }
        }, 5 * 60 * 1000)

        return () => clearInterval(intervalId)
    }, [])

    const signup = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData)
            const { user, accessToken } = response.data.details

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('user', JSON.stringify(user))
            setUser(user)

            // We do NOT redirect to /onboarding here anymore because parent component might handle it
            // or we might show OnboardingFlow overlay.
            // But if used in pages/signup.js, we might want to return data so parent can decide.
            // The original code pushed to /onboarding.
            // The user wants "open it on Sign up".
            // So pages/signup.js will handle navigation or flow.
            // I will remove router.push from here to be more flexible.
            // Wait, if I remove it, existing calls might break if they expected redirect.
            // pages/signup.js currently does: `router.push('/onboarding')` in handleStep3Submit? 
            // No, the previous `pages/signup.js` code (before I modified it to use OnboardingFlow which I haven't yet)
            // did `await signup(...)`.
            // Wait, `pages/signup.js` currently redirects to `/onboarding`.
            // I will leave router.push in `signup` here for now, or remove it and let `pages/signup.js` handle it.
            // If I remove it, I must update `pages/signup.js` to redirect.
            // Given the requirement to show OnboardingFlow "while sending request" or "open it on Sign up",
            // `pages/signup.js` likely will mount `OnboardingFlow` instead of redirecting.
            // So removing `router.push` is correct for flexibility.

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

    const logout = async () => {
        try {
            // Optional: Call revoke session endpoint
        } catch (error) {
            console.error("Logout error", error)
        } finally {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
            setUser(null)
            router.push('/login')
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
