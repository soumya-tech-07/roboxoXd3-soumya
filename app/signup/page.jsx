'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // TODO: Implement actual registration logic
    console.log('Signup attempt:', formData);
    
    // For now, just redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 tracking-wide">
            Join us and start shopping
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs tracking-wider text-gray-900 mb-2 uppercase"
              >
                FIRST NAME
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                placeholder="First name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-xs tracking-wider text-gray-900 mb-2 uppercase"
              >
                LAST NAME
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                placeholder="Last name"
                required
              />
            </div>
          </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors pr-12"
                placeholder="Create a password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            <p className="text-[10px] text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs tracking-wider text-gray-900 mb-2 uppercase"
            >
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors pr-12"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 text-sm"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 border-gray-300 text-brand focus:ring-brand"
              required
            />
            <label htmlFor="agreeToTerms" className="text-xs text-gray-600">
              I agree to the{' '}
              <Link href="/terms" className="text-brand hover:underline">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-brand hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors"
          >
            CREATE ACCOUNT
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 mb-2">
            Already have an account?
          </p>
          <Link
            href="/login"
            className="text-xs text-brand hover:underline tracking-wider uppercase"
          >
            LOGIN
          </Link>
        </div>

        {/* Divider */}
        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-xs text-gray-500 uppercase">OR</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Social Signup Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full py-3 border border-gray-300 text-sm tracking-wide text-gray-900 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2"
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
            className="w-full py-3 border border-gray-300 text-sm tracking-wide text-gray-900 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 3.405-2.051 4.537-.348.348-.754.653-1.207.916-.453.262-.954.48-1.503.653-.549.173-1.14.26-1.773.26-.633 0-1.224-.087-1.773-.26-.549-.173-1.05-.391-1.503-.653-.453-.263-.859-.568-1.207-.916.348-.348.653-.754.916-1.207.262-.453.48-.954.653-1.503.173-.549.26-1.14.26-1.773 0-.633-.087-1.224-.26-1.773-.173-.549-.391-1.05-.653-1.503-.263-.453-.568-.859-.916-1.207-.348-.348-.754-.653-1.207-.916C13.224.391 12.633.26 12 .26c-.633 0-1.224.131-1.773.26-.549.173-1.05.391-1.503.653-.453.263-.859.568-1.207.916-.348.348-.653.754-.916 1.207-.262.453-.48.954-.653 1.503-.173.549-.26 1.14-.26 1.773 0 .633.087 1.224.26 1.773.173.549.391 1.05.653 1.503.263.453.568.859.916 1.207.348.348.754.653 1.207.916.453.262.954.48 1.503.653.549.173 1.14.26 1.773.26.633 0 1.224-.087 1.773-.26.549-.173 1.05-.391 1.503-.653.453-.263.859-.568 1.207-.916.348-.348.653-.754.916-1.207.262-.453.48-.954.653-1.503.173-.549.26-1.14.26-1.773V8.16h-1.032z"/>
            </svg>
            CONTINUE WITH FACEBOOK
          </button>
        </div>
      </div>
    </div>
  );
}

