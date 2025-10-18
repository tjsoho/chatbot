"use client";

import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("adminAuth", "true");
      console.log("Login successful, calling onLogin callback");
      onLogin();
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log("Login callback completed");
      }, 100);
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setResetMessage("");

    try {
      // Use custom action code settings to redirect to our custom reset page
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, resetEmail, actionCodeSettings);
      setResetMessage("Password reset email sent! Please check your inbox AND spam/junk folder - these emails are often filtered by email providers.");
      setResetEmail("");
    } catch (error) {
      console.error("Password reset error:", error);
      setResetMessage(error instanceof Error ? error.message : "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Manage your AI chatbot conversations, monitor performance, and configure settings with our comprehensive admin dashboard.
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/90">Real-time conversation monitoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/90">Advanced analytics & insights</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/90">User feedback management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <span className="text-white/90">Bot configuration tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
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
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {showForgotPassword ? "Enter your email to reset your password. Don't forget to check your spam/junk folder!" : "Sign in to your admin dashboard"}
            </p>
          </div>

          {showForgotPassword ? (
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BF63] focus:border-[#00BF63] transition-colors text-black"
                    placeholder="Enter your email address"
                  />
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Important:</strong> Check your spam/junk folder if you don&apos;t receive the email within a few minutes. Password reset emails are often filtered by email providers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {resetMessage && (
                <div className={`text-sm ${resetMessage.includes("sent") ? "text-green-600" : "text-red-600"}`}>
                  {resetMessage}
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#00BF63] hover:bg-[#00A854] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage("");
                    setResetEmail("");
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Back to Login
                </button>
              </div>
            </form>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BF63] focus:border-[#00BF63] transition-colors text-black"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BF63] focus:border-[#00BF63] transition-colors text-black"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00BF63] hover:bg-[#00A854] text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#00BF63] hover:text-[#00A854] focus:outline-none focus:underline transition-colors"
                >
                  Forgot your password?
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
