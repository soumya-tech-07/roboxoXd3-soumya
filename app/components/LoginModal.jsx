'use client';

import { useState, useEffect } from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginModal() {
  const { isOpen, modalType, closeModal, switchToSignup } = useAuthModal();
  const { signIn, resetPassword } = useAuth();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && modalType === 'login') {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, modalType, closeModal]);

  if (!isOpen || modalType !== 'login') return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        const errorMessage = signInError.message || 'Invalid email or password. Please try again.';
        setError(errorMessage);
        showError(errorMessage);
        setLoading(false);
        return;
      }

      // Success - show toast and close modal
      showSuccess('Logged in successfully!');
      closeModal();
      setEmail('');
      setPassword('');
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        const errorMessage = resetError.message || 'Failed to send reset email. Please try again.';
        setError(errorMessage);
        showError(errorMessage);
        return;
      }

      setResetEmailSent(true);
      showSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            LOGIN
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <p className="text-xs sm:text-sm text-gray-600 tracking-wide mb-6">
            Welcome back to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs tracking-wider text-gray-900 mb-2 uppercase"
              >
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs tracking-wider text-gray-900 mb-2 uppercase"
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            {!showForgotPassword && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-gray-600 hover:text-brand underline cursor-pointer"
                >
                  FORGOT PASSWORD?
                </button>
              </div>
            )}

            {/* Forgot Password Form */}
            {showForgotPassword && !resetEmailSent && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                  }}
                  className="text-xs text-gray-600 hover:text-brand underline cursor-pointer"
                >
                  Back to login
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full py-4 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                >
                  SEND RESET LINK
                </button>
              </div>
            )}

            {/* Reset Email Sent Confirmation */}
            {resetEmailSent && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                  Password reset email sent! Please check your inbox.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmailSent(false);
                  }}
                  className="w-full py-4 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                >
                  BACK TO LOGIN
                </button>
              </div>
            )}

            {/* Submit Button */}
            {!showForgotPassword && !resetEmailSent && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            )}
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 mb-2">
              Don&apos;t have an account?
            </p>
            <button
              onClick={switchToSignup}
              className="text-xs text-brand hover:underline tracking-wider uppercase cursor-pointer"
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-xs text-gray-500 uppercase">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          {/* <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 border border-gray-300 text-sm tracking-wide text-gray-900 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
            <button
              type="button"
              className="w-full py-3 border border-gray-300 text-sm tracking-wide text-gray-900 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 3.405-2.051 4.537-.348.348-.754.653-1.207.916-.453.262-.954.48-1.503.653-.549.173-1.14.26-1.773.26-.633 0-1.224-.087-1.773-.26-.549-.173-1.05-.391-1.503-.653-.453-.263-.859-.568-1.207-.916C4.328 11.565 3.601 10.018 3.432 8.16H2.4v7.68c0 .633.087 1.224.26 1.773.173.549.391 1.05.653 1.503.263.453.568.859.916 1.207.348.348.754.653 1.207.916.453.262.954.48 1.503.653.549.173 1.14.26 1.773.26.633 0 1.224-.087 1.773-.26.549-.173 1.05-.391 1.503-.653.453-.263.859-.568 1.207-.916.348-.348.653-.754.916-1.207.262-.453.48-.954.653-1.503.173-.549.26-1.14.26-1.773V8.16h-1.032z"/>
              </svg>
              CONTINUE WITH FACEBOOK
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}

