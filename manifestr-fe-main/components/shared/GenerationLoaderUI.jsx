import React from 'react';
import { useRouter } from 'next/router';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

export default function GenerationLoaderUI({ loading, status, error, children }) {
    const router = useRouter();

    if (status === 'FAILED') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <div className="bg-red-50 p-6 rounded-2xl flex flex-col items-center max-w-md text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Generation Failed</h2>
                    <p className="text-gray-600 mb-6">
                        {error || "We couldn't generate your document. Please try again."}
                    </p>
                    <Button
                        variant="primary"
                        onClick={() => router.push('/create-project')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Create New Project
                    </Button>
                </div>
            </div>
        );
    }

    if (loading || status === 'POLLING' || status === 'LOADING') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-black animate-spin" />
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900">
                            {status === 'POLLING' ? 'Finalizing your document...' : 'Loading...'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            This usually takes a few seconds.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return children;
}
