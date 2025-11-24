/**
 * Authentication Hook
 * Handles all authentication-related operations
 */

import { useState, useCallback } from 'react';
import { graphqlMutation } from '@/lib/graphql-client';
import { REQUEST_OTP, VERIFY_OTP, LOGOUT } from '@/graphql/mutations';

interface OTPResponse {
  requestOTP: {
    success: boolean;
    message: string;
    otp?: string;
  };
}

interface VerifyOTPResponse {
  verifyOTP: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    message: string;
  };
}

export function useAuthMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Request OTP for email
   */
  const requestOTP = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlMutation<OTPResponse>(REQUEST_OTP, { email });
      return data.requestOTP;
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Verify OTP and login
   */
  const verifyOTP = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await graphqlMutation<VerifyOTPResponse>(VERIFY_OTP, {
        email,
        otp,
      });
      return data.verifyOTP;
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await graphqlMutation(LOGOUT);
    } catch (err: any) {
      setError(err.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requestOTP,
    verifyOTP,
    logout,
    loading,
    error,
  };
}

