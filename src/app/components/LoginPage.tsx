"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Alert } from './ui';

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation RequestOTP($email: String!) {
              requestOTP(email: $email) {
                success
                message
              }
            }
          `,
          variables: { email },
        }),
      });

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      if (result.data.requestOTP.success) {
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, otp);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          query: `
            mutation RequestOTP($email: String!) {
              requestOTP(email: $email) {
                success
                message
              }
            }
          `,
          variables: { email },
        }),
      });

      const result = await response.json();
      
      if (result.data.requestOTP.success) {
        alert('New OTP sent to your email!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.svg" 
              alt="Ultra Ship Logo" 
              width={120} 
              height={52} 
              priority
              className="dark:invert"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === 'email' ? 'Sign in with OTP' : 'Enter verification code'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@company.com"
              className="py-3"
            />

            {error && <Alert variant="error">{error}</Alert>}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <Input
                type="text"
                label="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="py-3 text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                autoComplete="off"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                Sent to {email}
              </p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={otp.length !== 6}
            >
              Verify & Sign In
            </Button>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setError('');
                }}
                className="flex-1"
              >
                Change Email
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={loading}
                className="flex-1 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
              >
                Resend OTP
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
            ℹ️ Test Accounts
          </p>
          <div className="space-y-1 text-xs text-blue-800 dark:text-blue-400">
            <p><strong>Admin:</strong> admin@company.com</p>
            <p><strong>Employee:</strong> employee@company.com</p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
              📧 Check console for OTP (email service is in development mode)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
