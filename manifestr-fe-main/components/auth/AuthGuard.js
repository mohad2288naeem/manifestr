import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const UNPROTECTED_ROUTES = [
    '/',
    '/login',
    '/signup',
    '/forgot-password'
];

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const GUEST_ONLY_ROUTES = [
        '/login',
        '/signup',
        '/forgot-password'
    ];

    useEffect(() => {
        if (!loading) {
            // Check if current path matches any unprotected route
            const isUnprotected = UNPROTECTED_ROUTES.includes(router.pathname);
            const isGuestOnly = GUEST_ONLY_ROUTES.includes(router.pathname);

            if (!isUnprotected && !user) {
                router.push('/login');
            } else if (isGuestOnly && user) {
                router.push('/home');
            }
        }
    }, [user, loading, router.pathname]);

    // While loading auth state, show nothing or a loading spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const isUnprotected = UNPROTECTED_ROUTES.includes(router.pathname);
    const isGuestOnly = GUEST_ONLY_ROUTES.includes(router.pathname);

    // If user is unauthenticated and route is protected, don't render
    if (!user && !isUnprotected) {
        return null;
    }

    // If user is authenticated and route is guest only, don't render
    if (user && isGuestOnly) {
        return null;
    }

    return children;
}
