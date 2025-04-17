'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ForgotPasswordCardProps {
  setView: (view: string) => void;
}

const ForgotPasswordCard = ({ setView }: ForgotPasswordCardProps) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setError('No account found with this email address');
        } else {
          setError(data.error || 'Failed to send OTP');
        }
      } else {
        setMessage(data.message || 'OTP sent to your email');
        setStep('otp');
        
        // Set resend cooldown
        setResendDisabled(true);
        setResendCountdown(60);
        const interval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/forgot-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to resend OTP');
      } else {
        setMessage('New OTP sent to your email');
        
        // Set resend cooldown
        setResendDisabled(true);
        setResendCountdown(60);
        const interval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
    
      const data = await res.json();
      if (!res.ok) {
        if (data.error === 'Invalid OTP.') {
          setError('The OTP you entered is incorrect. Please try again.');
        } else if (data.error === 'OTP expired or invalid.') {
          setError('Your OTP has expired. Please request a new one.');
        } else {
          setError(data.error || 'OTP verification failed');
        }
      } else {
        setMessage(data.message || 'OTP verified successfully');
        setStep('reset');
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Password strength validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, new_password: newPassword }),
      });
    
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setError('User account no longer exists');
        } else {
          setError(data.error || 'Failed to reset password');
        }
      } else {
        setMessage('Password reset successful! Redirecting to login...');
        setTimeout(() => setView('login'), 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Reset failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-12 py-4 max-w-md:p-4 md:p-6 my-auto flex flex-col space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">Forgot Password</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{message}</span>
        </div>
      )}

      {step === 'email' && (
        <form onSubmit={handleEmailSubmit}>
          <p className="text-gray-600 mb-4">
            Enter your email address and we'll send you an OTP to reset your password.
          </p>
          <Label className="block">
            <span className="text-lg">Email</span>
            <Input
              className="h-14 mt-2"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Label>
          <Button
            type="submit"
            className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send OTP'}
          </Button>
          <Button
            variant="link"
            className="mt-4 text-blue-500 text-lg w-full"
            onClick={() => setView('login')}
          >
            Back to Login
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit}>
          <p className="text-gray-600 mb-4">
            We've sent a 6-digit OTP to <strong>{email}</strong>. Please check your inbox and enter the code below.
          </p>
          <Label className="block">
            <span className="text-lg">Enter OTP</span>
            <Input
              className="h-14 mt-2"
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
              required
              maxLength={6}
            />
          </Label>
          <Button
            type="submit"
            className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <div className="mt-4 text-center">
            <Button
              type="button"
              variant="link"
              className="text-blue-500"
              onClick={handleResendOTP}
              disabled={resendDisabled}
            >
              {resendDisabled 
                ? `Resend OTP (${resendCountdown}s)` 
                : 'Didn\'t receive the code? Resend OTP'}
            </Button>
          </div>
          
          <Button
            type="button"
            variant="link"
            className="mt-2 text-blue-500 text-lg w-full"
            onClick={() => setStep('email')}
          >
            Change Email
          </Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword}>
          <p className="text-gray-600 mb-4">
            Create a new password for your account.
          </p>
          <Label className="block mt-4">
            <span className="text-lg">New Password</span>
            <Input
              className="h-14 mt-2"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Label>
          <Label className="block mt-4">
            <span className="text-lg">Confirm Password</span>
            <Input
              className="h-14 mt-2"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Label>
          <Button
            type="submit"
            className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordCard;