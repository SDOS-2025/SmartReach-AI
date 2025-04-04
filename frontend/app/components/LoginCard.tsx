'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface LoginCardProps {
  view: string;
  setView: (view: string) => void;
}

const LoginCard = ({ view, setView }: LoginCardProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [emailHostUser, setEmailHostUser] = useState('');
  const [emailHostPassword, setEmailHostPassword] = useState('');
  const [emailHost, setEmailHost] = useState('');
  const [emailPort, setEmailPort] = useState('');
  const [emailUseTLS, setEmailUseTLS] = useState(true);
  const [showLoginErrors, setShowLoginErrors] = useState(false);
  const [showSignupIndErrors, setShowSignupIndErrors] = useState(false);
  const [showSignupBusErrors, setShowSignupBusErrors] = useState(false);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/social-auth/login/google-oauth2/';
  };

  const isLoginValid = () => username.trim() !== '' && password.trim() !== '';
  const isSignupIndividualValid = () => username.trim() !== '' && email.trim() !== '' && password.trim() !== '';
  const isSignupBusinessValid = () =>
    username.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    emailHostUser.trim() !== '' &&
    emailHostPassword.trim() !== '' &&
    emailHost.trim() !== '' &&
    emailPort.trim() !== '';

  const handleLogin = async () => {
    setShowLoginErrors(true);
    if (!isLoginValid()) {
      console.error('Please fill all required fields: Username, Password');
      return;
    }

    const requestBody = { username, password };
    try {
      const response = await fetch('http://localhost:8000/api/user-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        console.log("Status Code:", response.status);
        const errorData = await response.json();
        console.error('Login error:', errorData);
        return;
      }
      const data = await response.json();
      console.log('Login response:', data);
      if (data.message === 'Login successful' && data.token) {
        localStorage.setItem("authToken", data.token); // Save token for auth state
        window.location.href = '/home';
      }
      
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const renderLoginForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to SmartReachAI</h1>
      <h2 className="text-3xl mb-3 flex justify-center">Login</h2>
      <Label className="block">
        <Input
          className="h-14"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (!username.trim()) return;
              passwordInputRef.current?.focus();
            }
          }}
          required
        />
        {showLoginErrors && !username && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <Label className="block mt-4">
        <Input
          className="h-14"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ref={passwordInputRef}
          required
        />
        {showLoginErrors && !password && <p className="text-red-500 text-sm mt-1">This field is required</p>}
      </Label>
      <a href="#" className="text-sm text-blue-500 hover:underline mb-3">
        Forgot Password?
      </a>
      <Button
        type="submit"
        className="w-full bg-blue-500 h-14 text-xl text-white py-2 mt-1 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-md hover:shadow-blue-500/50 animate-shrink-shadow"
      >
        Login
      </Button>
      <div className="flex items-center my-4">
        <Separator className="flex-auto" />
        <span className="mx-2 text-xl flex-none text-gray-500">or</span>
        <Separator className="flex-auto" />
      </div>
      <Button
        type="button"
        className="w-full bg-red-500 h-14 text-xl text-white py-2 rounded-full hover:bg-red-600 transition-all duration-300 ease-in-out hover:scale-95 hover:shadow-md hover:shadow-red-500/50 animate-shrink-shadow"
        onClick={handleGoogleLogin}
      >
        Login with Google
      </Button>
    </form>
  );

  return (
    <div className="px-12 py-4 max-w-md:p-4 md:p-6 my-auto flex flex-col space-y-6">
      {view === 'login' && renderLoginForm()}
      <style jsx>{`
        @keyframes shrink-shadow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(0, 0, 0, 0); }
          50% { transform: scale(0.98); box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
        }
        .animate-shrink-shadow { animation: shrink-shadow 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default LoginCard;
