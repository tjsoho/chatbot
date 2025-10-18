"use client";



interface PasswordResetSuccessProps {
    onBackToLogin: () => void;
}

export default function PasswordResetSuccess({ onBackToLogin }: PasswordResetSuccessProps) {
    return (
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Password Reset Successful!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Your password has been successfully reset. You can now log in with your new password.
            </p>

            <div className="mt-6">
                <button
                    onClick={onBackToLogin}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
}
