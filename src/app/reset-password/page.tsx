"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

function ResetPasswordContent() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isValidCode, setIsValidCode] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const oobCode = searchParams.get('oobCode');
        if (oobCode) {
            verifyResetCode(oobCode);
        } else {
            setMessage("Invalid or missing reset code.");
        }
    }, [searchParams]);

    const verifyResetCode = async (oobCode: string) => {
        try {
            const email = await verifyPasswordResetCode(auth, oobCode);
            setEmail(email);
            setIsValidCode(true);
            setMessage("Please enter your new password below.");
        } catch (error) {
            console.error("Error verifying reset code:", error);
            setMessage("Invalid or expired reset code. Please request a new password reset.");
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        setMessage("");

        try {
            const oobCode = searchParams.get('oobCode');
            if (!oobCode) {
                throw new Error("No reset code found");
            }

            await confirmPasswordReset(auth, oobCode, newPassword);
            setIsSuccess(true);
            setMessage("Password reset successfully! You can now log in with your new password.");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            console.error("Error resetting password:", error);
            setMessage(errorMessage || "Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isValidCode && !isSuccess) {
        return (
            <div className="min-h-screen flex">
                {/* Left Column - App Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00BF63] to-[#00A854] flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md text-center space-y-8">
                        {/* App Icon */}
                        <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>

                        {/* App Name & Description */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold">ChatBot Admin</h1>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Secure password reset for your admin dashboard. Your account security is our priority.
                            </p>
                        </div>

                        {/* Security Features */}
                        <div className="space-y-3 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <span className="text-white/90">Secure password reset process</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <span className="text-white/90">Email verification required</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <span className="text-white/90">Protected admin access</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Reset Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gray-50">
                    <div className="max-w-md w-full space-y-8">
                        {/* Mobile App Icon - Only visible on mobile */}
                        <div className="lg:hidden flex justify-center">
                            <div className="w-16 h-16 bg-[#00BF63] rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                Reset Password
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                {message}
                            </p>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/admin"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#00BF63] hover:bg-[#00A854] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BF63] transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex">
                {/* Left Column - App Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00BF63] to-[#00A854] flex-col items-center justify-center p-12 text-white">
                    <div className="max-w-md text-center space-y-8">
                        {/* Success Icon */}
                        <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Success Message */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold">Password Reset Complete!</h1>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Your account security has been restored. You can now access your admin dashboard with your new password.
                            </p>
                        </div>

                        {/* Security Features */}
                        <div className="space-y-3 text-left">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <span className="text-white/90">Secure password updated</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <span className="text-white/90">Account access restored</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                                <span className="text-white/90">Admin dashboard ready</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Success Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gray-50">
                    <div className="max-w-md w-full space-y-8">
                        {/* Mobile Success Icon - Only visible on mobile */}
                        <div className="lg:hidden flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-center text-3xl font-extrabold text-gray-900">
                                Password Reset Successful!
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                        </div>

                        {/* Important reminder about spam folder */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        For future password resets:
                                    </h3>
                                    <p className="mt-1 text-sm text-yellow-700">
                                        Always check your spam/junk folder when requesting password resets. These emails are often filtered by email providers.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Link
                                href="/admin"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#00BF63] hover:bg-[#00A854] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00BF63] transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Column - App Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00BF63] to-[#00A854] flex-col items-center justify-center p-12 text-white">
                <div className="max-w-md text-center space-y-8">
                    {/* App Icon */}
                    <div className="mx-auto w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>

                    {/* App Name & Description */}
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold">ChatBot Admin</h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Create a new secure password for your admin account. Choose a strong password to protect your dashboard.
                        </p>
                    </div>

                    {/* Security Features */}
                    <div className="space-y-3 text-left">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                            <span className="text-white/90">Strong password requirements</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                            <span className="text-white/90">Secure password reset</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                            <span className="text-white/90">Protected admin access</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Reset Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gray-50">
                <div className="max-w-md w-full space-y-8">
                    {/* Mobile App Icon - Only visible on mobile */}
                    <div className="lg:hidden flex justify-center">
                        <div className="w-16 h-16 bg-[#00BF63] rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-center text-3xl font-extrabold text-gray-900">
                            Reset Password
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter a new password for {email}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BF63] focus:border-[#00BF63] transition-colors text-black"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BF63] focus:border-[#00BF63] transition-colors text-black"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                                {message}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#00BF63] hover:bg-[#00A854] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/admin"
                                className="text-sm text-[#00BF63] hover:text-[#00A854] focus:outline-none focus:underline transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-t-[3px] border-b-[3px] border-t-[#0ff] border-b-[#f0f] mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        </div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
